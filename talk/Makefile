.PHONY: present
present: \
	compiled/reverse_proxy.svg \
	downloads/images/compose_logo.png \
	downloads/images/nginx_logo.svg \
	downloads/images/react_logo.svg \
	downloads/images/webpack_logo.svg \
	| downloads/fonts/orkney downloads/images/dockerlogos
	hovercraft talk.rst

compiled/%.svg: %.plantuml | compiled
	java -jar ~/java/plantuml.jar -tsvg -o compiled $<

compiled:
	mkdir -p compiled

downloads/fonts/orkney: downloads/orkney.zip | downloads/fonts
	mkdir -p downloads/fonts/orkney && \
		unzip -d downloads/fonts/orkney downloads/orkney.zip

downloads/orkney.zip: | downloads
	curl -o downloads/orkney.zip \
	https://fontlibrary.org/assets/downloads/orkney/99f93483b92aaa9f10d3780aba2997e7/orkney.zip

downloads/images/compose_logo.png: | downloads/images
	curl -L -o downloads/images/compose_logo.png \
	https://github.com/docker/compose/raw/master/logo.png

downloads/images/webpack_logo.svg: | downloads/images
	curl -o downloads/images/webpack_logo.svg \
	https://webpack.js.org/assets/icon-square-big.svg

downloads/images/react_logo.svg: | downloads/images
	curl -L -o downloads/images/react_logo.svg \
	https://raw.githubusercontent.com/facebook/create-react-app/next/packages/react-scripts/template/src/logo.svg

downloads/images/nginx_logo.svg: | downloads/images
	curl -o downloads/images/nginx_logo.svg \
	https://cdn-1.wp.nginx.com/wp-content/uploads/2018/03/icon-NGINX-OSS.svg

downloads/images/dockerlogos: downloads/dockerlogos.zip | downloads/images
	mkdir -p downloads/images/dockerlogos && \
		unzip -d downloads/images/dockerlogos downloads/dockerlogos.zip

downloads/dockerlogos.zip: | downloads
	curl -o downloads/dockerlogos.zip \
	https://www.docker.com/sites/default/files/legal/docker_logos_2018.zip

downloads/fonts:
	mkdir -p downloads/fonts

downloads:
	mkdir -p downloads

downloads/images:
	mkdir -p downloads/images

.PHONY: clean
clean:
	rm -rf downloads compiled
