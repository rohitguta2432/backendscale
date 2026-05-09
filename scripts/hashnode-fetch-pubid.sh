#!/usr/bin/env bash
# Fetch Hashnode publication ID after blog created.
# Usage: HASHNODE_API_KEY=xxx bash scripts/hashnode-fetch-pubid.sh
set -e
: "${HASHNODE_API_KEY:?Set HASHNODE_API_KEY first}"
curl -s -X POST https://gql.hashnode.com/ \
  -H "Authorization: $HASHNODE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ me { username publications(first:10){ edges { node { id title url } } } } }"}' \
  | python3 -m json.tool
echo
echo "Copy the 'id' field above and run:"
echo "  echo 'set -gx HASHNODE_PUBLICATION_ID \"<id>\"' >> ~/.config/fish/config.fish"
