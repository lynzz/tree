!function(){
	function Node(o) {
	  this.setData(o);
	  this.children = [];
	  this.parent = null;
	}

	Node.prototype.setData = function(o) {
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
	};

	Node.prototype.initFromData = function(data) {
	  var addChildren, addNode,
	    _this = this;
	  addNode = function(node_data) {
	    _this.setData(node_data);
	    if (node_data.children) {
	      return addChildren(node_data.children);
	    }
	  };
	  addChildren = function(children_data) {
	    var child, node, _i, _len;
	    for (_i = 0, _len = children_data.length; _i < _len; _i++) {
	      child = children_data[_i];
	      node = new Node('');
	      node.initFromData(child);
	      _this.addChild(node);
	    }
	    return null;
	  };
	  addNode(data);
	  return null;
	};

	/*
	    Create tree from data.
	
	    Structure of data is:
	    [
	        {
	            label: 'node1',
	            children: [
	                { label: 'child1' },
	                { label: 'child2' }
	            ]
	        },
	        {
	            label: 'node2'
	        }
	    ]
	*/


	Node.prototype.loadFromData = function(data) {
	  var node, o, _i, _len;
	  this.children = [];
	  for (_i = 0, _len = data.length; _i < _len; _i++) {
	    o = data[_i];
	    node = new Node(o);
	    this.addChild(node);
	    if (typeof o === 'object' && o.children) {
	      node.loadFromData(o.children);
	    }
	  }
	  return null;
	};

	/*
	    Add child.
	
	    tree.addChild(
	        new Node('child1')
	    );
	*/


	Node.prototype.addChild = function(node) {
	  this.children.push(node);
	  return node._setParent(this);
	};

	/*
	    Add child at position. Index starts at 0.
	
	    tree.addChildAtPosition(
	        new Node('abc'),
	        1
	    );
	*/


	Node.prototype.addChildAtPosition = function(node, index) {
	  this.children.splice(index, 0, node);
	  return node._setParent(this);
	};

	Node.prototype._setParent = function(parent) {
	  this.parent = parent;
	  this.tree = parent.tree;
	  return this.tree.addNodeToIndex(this);
	};

	/*
	    Remove child.
	
	    tree.removeChild(tree.children[0]);
	*/


	Node.prototype.removeChild = function(node) {
	  this.children.splice(this.getChildIndex(node), 1);
	  return this.tree.removeNodeFromIndex(node);
	};

	/*
	    Get child index.
	
	    var index = getChildIndex(node);
	*/


	Node.prototype.getChildIndex = function(node) {
	  return $.inArray(node, this.children);
	};

	/*
	    Does the tree have children?
	
	    if (tree.hasChildren()) {
	        //
	    }
	*/


	Node.prototype.hasChildren = function() {
	  return this.children.length !== 0;
	};

	Node.prototype.isFolder = function() {
	  return this.hasChildren() || this.load_on_demand;
	};

	/*
	    Iterate over all the nodes in the tree.
	
	    Calls callback with (node, level).
	
	    The callback must return true to continue the iteration on current node.
	
	    tree.iterate(
	        function(node, level) {
	           console.log(node.name);
	
	           // stop iteration after level 2
	           return (level <= 2);
	        }
	    );
	*/


	Node.prototype.iterate = function(callback) {
	  var _iterate,
	    _this = this;
	  _iterate = function(node, level) {
	    var child, result, _i, _len, _ref;
	    if (node.children) {
	      _ref = node.children;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        child = _ref[_i];
	        result = callback(child, level);
	        if (_this.hasChildren() && result) {
	          _iterate(child, level + 1);
	        }
	      }
	      return null;
	    }
	  };
	  _iterate(this, 0);
	  return null;
	};

	/*
	    Move node relative to another node.
	
	    Argument position: Position.BEFORE, Position.AFTER or Position.Inside
	
	    // move node1 after node2
	    tree.moveNode(node1, node2, Position.AFTER);
	*/


	Node.prototype.moveNode = function(moved_node, target_node, position) {
	  if (moved_node.isParentOf(target_node)) {
	    return;
	  }
	  moved_node.parent.removeChild(moved_node);
	  if (position === Position.AFTER) {
	    return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node) + 1);
	  } else if (position === Position.BEFORE) {
	    return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node));
	  } else if (position === Position.INSIDE) {
	    return target_node.addChildAtPosition(moved_node, 0);
	  }
	};

	/*
	    Get the tree as data.
	*/


	Node.prototype.getData = function() {
	  var getDataFromNodes,
	    _this = this;
	  getDataFromNodes = function(nodes) {
	    var data, k, node, tmp_node, v, _i, _len;
	    data = [];
	    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
	      node = nodes[_i];
	      tmp_node = {};
	      for (k in node) {
	        v = node[k];
	        if ((k !== 'parent' && k !== 'children' && k !== 'element' && k !== 'tree') && Object.prototype.hasOwnProperty.call(node, k)) {
	          tmp_node[k] = v;
	        }
	      }
	      if (node.hasChildren()) {
	        tmp_node.children = getDataFromNodes(node.children);
	      }
	      data.push(tmp_node);
	    }
	    return data;
	  };
	  return getDataFromNodes(this.children);
	};

	Node.prototype.getNodeByName = function(name) {
	  var result;
	  result = null;
	  this.iterate(function(node) {
	    if (node.name === name) {
	      result = node;
	      return false;
	    } else {
	      return true;
	    }
	  });
	  return result;
	};

	Node.prototype.addAfter = function(node_info) {
	  var child_index, node;
	  if (!this.parent) {
	    return null;
	  } else {
	    node = new Node(node_info);
	    child_index = this.parent.getChildIndex(this);
	    this.parent.addChildAtPosition(node, child_index + 1);
	    return node;
	  }
	};

	Node.prototype.addBefore = function(node_info) {
	  var child_index, node;
	  if (!this.parent) {
	    return null;
	  } else {
	    node = new Node(node_info);
	    child_index = this.parent.getChildIndex(this);
	    return this.parent.addChildAtPosition(node, child_index);
	  }
	};

	Node.prototype.addParent = function(node_info) {
	  var child, new_parent, original_parent, _i, _len, _ref;
	  if (!this.parent) {
	    return null;
	  } else {
	    new_parent = new Node(node_info);
	    new_parent._setParent(this.tree);
	    original_parent = this.parent;
	    _ref = original_parent.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      new_parent.addChild(child);
	    }
	    original_parent.children = [];
	    original_parent.addChild(new_parent);
	    return new_parent;
	  }
	};

	Node.prototype.remove = function() {
	  if (this.parent) {
	    this.parent.removeChild(this);
	    return this.parent = null;
	  }
	};

	Node.prototype.append = function(node_info) {
	  var node;
	  node = new Node(node_info);
	  this.addChild(node);
	  return node;
	};

	Node.prototype.prepend = function(node_info) {
	  var node;
	  node = new Node(node_info);
	  this.addChildAtPosition(node, 0);
	  return node;
	};

	Node.prototype.isParentOf = function(node) {
	  var parent;
	  parent = node.parent;
	  while (parent) {
	    if (parent === this) {
	      return true;
	    }
	    parent = parent.parent;
	  }
	  return false;
	};
}()