"use strict";

const
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    marked = require('marked'),
    hljs = require('highlightjs'),
    logger = require('./logger'),
    {removeDirectory, copyRecursive} = require('./util');

const
    ARTICLES_FOLDER = 'articles',
    DRAFTS_FOLDER = 'drafts';


class DraftPublisher {

    constructor (draftName) {
        this.draftName = draftName;
        this.disqusId = null;
        this.disqusPageUrl = null;
        this.lastModifiedDate = null;
        this.lastModifiedDateDisplay = null;
    }

    /**
     * @returns {Promise}
     */
    async publish() {
        try {
            if (!this.checkDraftFolder()) {
                logger.error('Draft not found!');
                return false;
            }
            logger.success('Draft found.');

            if (!this.getLastModifiedDate()) {
                logger.error('Error getting last modified date.');
                return false;
            }
            logger.success(`Last modified date is: ${this.lastModifiedDateDisplay}.`);

            if (!this.obtainNextDisqusId()) {
                logger.error('Could not find next Disqus id file!');
                return false;
            }
            logger.success('Disqus id will be ' + this.disqusId);

            if (!await this.copyDraftDirectoryToArticles()) {
                logger.error('Error copying draft to articles.');
                return false;
            }
            logger.success('Article folder created.');

            if (!this.buildIndexHtml()) {
                logger.error('Failed editing target HTML file.');
                this.rollback();
                return false;
            }
            logger.success('HTML file edited successfully.');

            if (!this.saveJsonInfo()) {
                logger.error('Failed saving JSON info file.');
                this.rollback();
                return false;
            }
            logger.success('JSON info file created.');

            if (!this.commitDisqusId()) {
                logger.error('Error committing Disqus id.');
                this.rollback();
                return false;
            }
            logger.success('Committed Disqus id.');
        } catch (error) {
            logger.error(error);
            this.rollback();
            return false;
        }

        return true;
    }

    rollback() {
        const abortedArticleFolder = path.join(ARTICLES_FOLDER, this.draftName);
        removeDirectory(abortedArticleFolder);
        logger.info('Destination directory removed. Publishing aborted.');
    }

    checkDraftFolder() {
        return fs.existsSync(path.join(DRAFTS_FOLDER, this.draftName));

    }

    getLastModifiedDate() {
        const mdFileName = path.join(DRAFTS_FOLDER, this.draftName, 'index.md');
        const stat = fs.lstatSync(mdFileName);
        const modifiedDate = new Date(stat.mtime);
        this.lastModifiedDate = modifiedDate.toISOString();
        this.lastModifiedDateDisplay = moment(modifiedDate).format('MMMM Do YYYY');
        return true;
    }

    obtainNextDisqusId() {
        this.disqusId = fs.readFileSync('next-disqus-id', 'utf-8');
        return true;
    }

    commitDisqusId() {
        const nextDisqusId = (parseInt(this.disqusId, 10) + 1).toString();
        fs.writeFileSync('next-disqus-id', nextDisqusId, 'utf-8');
        return true;
    }

    async copyDraftDirectoryToArticles() {
        const targetArticleFolder = path.join(ARTICLES_FOLDER, this.draftName);
        if (fs.existsSync(targetArticleFolder)) {
            return false;  // fail if destination folder already exists
        }

        const draftFolder = path.join(DRAFTS_FOLDER, this.draftName);
        await copyRecursive(draftFolder, ARTICLES_FOLDER);
        return true;
    }

    buildIndexHtml() {
        const targetFileName = path.join(ARTICLES_FOLDER, this.draftName, 'index.html');
        const indexHtml = fs.readFileSync(targetFileName, 'utf-8');
        const $ = cheerio.load(indexHtml);

        this.injectDisqusScript($);
        this.injectMarkdownArticle($);
        DraftPublisher.populatePageTitle($);
        DraftPublisher.populatePageDescription($);  // has to come before injecting last modified date!
        this.injectLastModifiedDate($);
        // remove development scripts
        $('script[data-dev-dependency]').remove();

        fs.writeFileSync(targetFileName, $.html(), 'utf-8');
        return true;
    }

    injectDisqusScript($) {
        const disqusScriptFileName = path.join(ARTICLES_FOLDER, this.draftName, 'disqus.js');
        let disqusScript = fs.readFileSync(disqusScriptFileName, 'utf-8');
        this.disqusPageUrl = 'http://luciopaiva.com/articles/' + this.draftName;
        disqusScript = disqusScript.replace('#DISQUS_PAGE_URL#', this.disqusPageUrl);
        disqusScript = disqusScript.replace('#DISQUS_PAGE_IDENTIFIER#', this.disqusId);
        $('#disqus-script').text(disqusScript);
        // also save to local disqus.js copy for later use
        fs.writeFileSync(disqusScriptFileName, disqusScript, 'utf-8');
    }

    injectMarkdownArticle($) {
        const markdownArticleFileName = path.join(ARTICLES_FOLDER, this.draftName, 'index.md');
        const markdownArticle = fs.readFileSync(markdownArticleFileName, 'utf-8');
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value
        });
        const htmlArticle = marked(markdownArticle);
        $('#contents').html(htmlArticle);
    }

    injectLastModifiedDate($) {
        $('#contents h1').after(`<p class="last-updated">Last updated ${this.lastModifiedDateDisplay}</p>`);
    }

    static populatePageTitle($) {
        const pageTitle = $('#contents h1').text();
        $('title').text(pageTitle);
        logger.success(`Page title will be "${pageTitle}".`);
    }

    static populatePageDescription($) {
        const firstParagraph = $('#contents p').first();
        let pageDescription = '';
        if (firstParagraph) {
            const firstPhraseMatch = firstParagraph.text().match(/[^.]+/) || [''];
            if (firstPhraseMatch && firstPhraseMatch.length > 0 && firstPhraseMatch[0].length > 0) {
                pageDescription = firstPhraseMatch[0] + '.';
            }
        }
        if (pageDescription === '') {
            logger.warning('No page description found.');
        } else {
            $('meta[name="description"]').attr('content', pageDescription);
            logger.success(`Page description will be "${pageDescription}".`);
        }
    }

    saveJsonInfo() {
        const info = {
            name: this.draftName,
            disqusId: this.disqusId,
            disqusPageUrl: this.disqusPageUrl,
            lastModifiedDate: this.lastModifiedDate,
            lastModifiedDateDisplay: this.lastModifiedDateDisplay,
        };
        const jsonFileName = path.join(ARTICLES_FOLDER, this.draftName, 'article.json');
        fs.writeFileSync(jsonFileName, JSON.stringify(info, null, 4), 'utf-8');
        return true;
    }

    static listAvailableDrafts() {
        return fs.readdirSync(DRAFTS_FOLDER)
            .map(fileName => path.join(fileName))
            .map(filePath => [filePath, fs.statSync(filePath)])
            .filter(([filePath, stat]) => stat.isDirectory())
            .map(([filePath]) => filePath)
            .filter(filePath => !filePath.startsWith('_'));
    }
}

module.exports = DraftPublisher;
