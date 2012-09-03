!function($, Widget){
	var Node = Widget.extend({

    
    // 基本属性
		attrs:{
      data:null,
			children:[],
      parent:null

		},

    events:{
      'click .rui-tree':'say'
    },

    setup: function(){
      this._setData();
      this.render();
    },

    _onRenderData: function(){
      //console.log(this.get('data'))
    },

    _setData: function(){
      var key, value, ret, o = this.get('data');
      if (typeof o !== 'object') {
        return this.set('name', o);
      } else {
        ret = [];
        for (key in o) {
          value = o[key];
          if (key === 'label') {
            ret.push(this.set('name', value));
          } else {
            ret.push(this.set(this[key], value));
          }
        }
        return ret;
      }
    },

    _loadFormData: function(){
      var node, o, i, data = this.get('data'), len = data.length;
      this.children = [];
      for (i = 0; i < len; i++) {
        o = data[i];
        node = new Node(o);
        this.addChild(node);
        if (typeof o === 'object' && o.children) {
          node._loadFormData(o.children);
        }
      }
      return null;
    },

    _setParent: function(parent){
      this.parent = parent;
      this.tree = parent.tree;
      return this.tree.addNodeToIndex(this);
    },

    addChild: function(node){
      this.children.push(node);
      return node._setParent(this);
    },

		say: function(){
			var self = this;
			alert(this.get('name'))
		}
	});

  /*function Node(o){
    this._setData(o);
    this.children = [],
    this.parent = null;
  }
  Node.prototype = {
    _setData: function(o){
      var key, value, _results;
      if (typeof o !== 'object') {
        return this.name = o;
      } else {
        _results = [];
        for (key in o) {
          value = o[key];
          if (key === 'label') {
            _results.push(this.name = value);
          } else {
            _results.push(this[key] = value);
          }
        }
        return _results;
      }
    },
    _setParent: function(parent){
      this.parent = parent;
      this.tree = parent.tree;
      return this.tree.addNodeToIndex(this);
    }
  }

  var Tree = Widget.extend({

    attrs:{
      data:null
    },

    setup: function(){
      this._setData();
      this.render();
    },

    _onRenderData: function(){
      //console.log(this.get('data'))
    },
  })*/

  rui.Node = Node;

}(jQuery, rui.Widget);