
.PHONY: present
present: | fonts/orkney
	hovercraft talk.rst

fonts/orkney: fonts/orkney.zip
	unzip -d fonts/orkney fonts/orkney.zip

fonts/orkney.zip: | fonts
	curl -o fonts/orkney.zip \
	https://fontlibrary.org/assets/downloads/orkney/99f93483b92aaa9f10d3780aba2997e7/orkney.zip

fonts:
	mkdir fonts

.PHONY: clean
clean:
	rm -rf fonts
