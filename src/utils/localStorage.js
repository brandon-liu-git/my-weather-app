function Local(namespace) {
  this.name = namespace;
  this.portalDetal = {};
}

Local.prototype.setLocalStorage = function() {
  window.localStorage.setItem(this.name, JSON.stringify(this.portalDetal));
};

Local.prototype.getLocalStorage = function() {
  this.portalDetal = JSON.parse(window.localStorage.getItem(this.name) || '{}');
};

Local.prototype.get = function(key) {
  this.getLocalStorage();
  return key ? this.portalDetal[key] : this.portalDetal;
};

Local.prototype.set = function(key, value) {
  this.getLocalStorage();
  this.portalDetal[key] = value;
  this.setLocalStorage();
};

Local.prototype.clear = function() {
  this.portalDetal = {};
  this.setLocalStorage();
};

export default new Local('my-weather-app');
