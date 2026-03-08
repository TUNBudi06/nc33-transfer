.PHONY: bun-install
bun-install:
	bun install

.PHONY: bun-build
bun-build: bun-install
	bun run build

.PHONY: icon
icon: bun-install
	sed 's/<path/<path fill="#fff"/g' \
		<node_modules/@mdi/svg/svg/cloud-upload.svg \
		>img/app.svg
	sed 's/<path/<path fill="#000"/g' \
		<node_modules/@mdi/svg/svg/cloud-upload.svg \
		>img/app-dark.svg

.PHONY: build
build: bun-build icon

.PHONY: dist
dist: build
	rm -f nextcloud-transfer.tar.gz
	tar \
		--transform 's|^\.|transfer|' \
		-cvzf nextcloud-transfer.tar.gz \
		./appinfo \
		./COPYING \
		./img \
		./js \
		./lib \
		./l10n \
		./README.md
