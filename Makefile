.PHONY: persist
generate: SHELL := /bin/bash
generate:
	deno run --allow-read --allow-write --allow-net --allow-env --unstable ./src/index.ts

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
	deno lint --unstable ./src/

.PHONY: persist
persist: SHELL := /bin/bash
persist:
	git config --global user.name "re-taro-bot[bot]" &&\
	git config --global user.email $${MAIL_ADDRESS} &&\
	git add -A &&\
	if [ "$(git log -1 --pretty=%B)" = "chore: Update generated files" ]; then \
		git commit --amend --no-edit; \
	else \
		git commit -m "chore: Update generated files"; \
	fi &&\
	git push -f
