.PHONY: present
present: images/compose_logo.png \
	images/nginx_logo.svg \
	images/react_logo.svg \
	images/webpack_logo.svg \
	| fonts/orkney images/dockerlogos
	hovercraft talk.rst

fonts/orkney: downloads/orkney.zip | fonts
	unzip -d fonts/orkney downloads/orkney.zip

downloads/orkney.zip: | downloads
	curl -o downloads/orkney.zip \
	https://fontlibrary.org/assets/downloads/orkney/99f93483b92aaa9f10d3780aba2997e7/orkney.zip

images/compose_logo.png: | images
	curl -L -o images/compose_logo.png \
	https://github.com/docker/compose/raw/master/logo.png

images/webpack_logo.svg: | images
	curl -o images/webpack_logo.svg \
	https://webpack.js.org/assets/icon-square-big.svg

images/react_logo.svg: | images
	curl -L -o images/react_logo.svg \
	https://raw.githubusercontent.com/facebook/create-react-app/next/packages/react-scripts/template/src/logo.svg

images/nginx_logo.svg: | images
	curl -o images/nginx_logo.svg \
	https://cdn-1.wp.nginx.com/wp-content/uploads/2018/03/icon-NGINX-OSS.svg

images/dockerlogos: downloads/dockerlogos.zip | images
	unzip -d images/dockerlogos downloads/dockerlogos.zip

downloads/dockerlogos.zip: | downloads
	curl -o downloads/dockerlogos.zip \
	https://www.docker.com/sites/default/files/legal/docker_logos_2018.zip

fonts:
	mkdir fonts

downloads:
	mkdir downloads

images:
	mkdir images

.PHONY: clean
clean:
	rm -rf fonts downloads images
