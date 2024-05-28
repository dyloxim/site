# web_server container build script
# ---------------------------------
FROM fedora:latest
ENV container docker

# Perform a package update
RUN dnf -y update

# Add some familiar utilities
RUN dnf -y install procps htop grep findutils iputils iproute

# Set this to any desired version
ENV NODE_VERSION 20.13.1
# Can be anything, but this is a good default       
ENV NVM_DIR /usr/local/nvm
# Must match one of the tag versions on https://github.com/nvm-sh/nvm/tags     
ENV NVM_VERSION 0.39.7

# perform install
RUN mkdir -p $NVM_DIR \
  && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
  && . $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && node -v \
  && npm -v

ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules:$PATH

# Install next & pm2
# see instructions here: https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for

WORKDIR /vagrant
COPY . .
RUN npm install next@latest react@latest react-dom@latest

EXPOSE 3000
