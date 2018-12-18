var Rad = (function() {
  var Rad = {
    componentIds: new Set(),
    components: new Map(),
    Component: Component
  };

  // makeComponentId sourced from:
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  function makeComponentId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
    
  function Component(props = {}) {
    this.componentName = this.constructor.name;
  
    this.props = props;
  
    let componentId;
    if (!props.componentId) {
      componentId = makeComponentId();
      while (Rad.componentIds.has(componentId)) {
        componentId = makeComponentId();
      }

      Rad.componentIds.add(componentId)
      Rad.components.set(componentId, this);
      this.componentId = componentId;
    } else if (Rad.componentIds.has(props.componentId)) {
      throw `Non-unique componentId give for ${this.constructor.name}`;
    }
  
    this.html = this.render();
  
    setTimeout(() => this._registerListeners(), 250);
  }
  
  Component.prototype._registerListeners = function() {
    if (this._registerListeners === null || this._registerListeners === undefined)
      return;
  
    if (typeof this._registerListeners !== 'function')
      throw `${this.constructor.name}.prototype._registerListeners must be a function.`;
  };
  
  Component.prototype.render = function() {
    if (this.render === null || this.render === undefined)
      throw `${this.constructor.name}.prototype.render function not defined.`;
  
    if (typeof this.render !== 'function')
      throw `${this.constructor.name}.prototype.render must be a function.`;
  };
  
  Component.prototype.setState = function(nextState) {
    if (this.state && !Object.getPrototypeOf(this.state).constructor.name === 'Object')
      throw `${this.constructor.name} state must be an object`;
  
    if (Object.keys(this.state).length === 0)
      throw `${this.constructor.name} called setState but state is not initialized.`;
  
    this.state = { ...this.state, ...nextState };
  
    const currentNode = document.getElementById(this.componentId);
    const newHTML = this.render();
    const dummyDOM = new DOMParser().parseFromString(newHTML, 'text/html');
    const newNode = dummyDOM.getElementById(this.componentId);
    currentNode.parentNode.replaceChild(newNode, currentNode);

    this._registerListeners();
  }
  
  return Rad;
})(); 
