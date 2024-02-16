.PHONY: persist
generate: SHELL := /bin/bash
generate:
	deno run --allow-read --allow-write --allow-net --allow-env ./src/index.ts

.PHONY: format
format: SHELL := /bin/bash
format:
	deno fmt --check --options-single-quote

format-fix: SHELL := /bin/bash
format-fix:
	deno fmt --options-single-quote

.PHONY: lint
lint: SHELL := /bin/bash
lint:
	deno lint ./src/

.PHONY: persist
persist: SHELL := /bin/bash
persist:
	git config --global user.name "GitHub Actions" &&\
	git config --global user.email "actions@github.com" &&\
	git add -A &&\
	if [ "$(git log -1 --pretty=%B)" = "chore: Update generated files" ]; then \
		git commit --amend --no-edit; \
	else \
		git commit -m "chore: Update generated files"; \
	fi &&\
	git push -f
