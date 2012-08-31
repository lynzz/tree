!function($, Base){
	var Tree = Base.extend({
		attrs:{
			//element:'',
			name:'lzz'
		},
		initialize: function(element, options){
			Tree.superclass.initialize.call(this, options);
      //this.element = $(options.element).eq(0);
      this.element = $(element);
		},
		say: function(){
			var self = this;
			alert(this.get('name'))
		}
	});

	$.fn.tree = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('tree');
      var options = $.extend({}, $.fn.tree.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('tree', (data = new Tree(this, options)))
      if (typeof option == 'string') data[option].call($this)
    })
  };

  $.fn.tree.defaults = {
  	name:'lzz'	
  }

  $.fn.tree.Constructor = Tree;

  rui.Tree = Tree;

}(jQuery, rui.Base);