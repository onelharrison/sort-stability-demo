var RadDOM = (function() {
  return {
    render: function render(component, root) {
      root.innerHTML = component.html;
    }
  };
})();
