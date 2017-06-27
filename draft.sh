#!/usr/bin/env bash

if [ "$#" -ne 1 ]; then
    echo "Usage: ./draft <name-of-the-new-article>"
    exit 1
fi

DRAFTS_DIR=drafts/
DRAFT_NAME=$1
TEMPLATE_NAME=_template

if [ -d "${DRAFTS_DIR}${DRAFT_NAME}" ]; then
    echo "Directory already exists. Aborted."
    exit 1
fi

cd drafts/
cp -r ${TEMPLATE_NAME} ${DRAFT_NAME}

echo "Draft created."
