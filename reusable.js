(function(global){
    const document = global.document;

    function convertHTMLObjectToArray(HTMLObject){
        return [].slice.call(HTMLObject);
    }

    const Reusable = {
        parseTemplate: function(config){
            let template = config.template;
            const expressions = config.template.match(/{{\s+\w+\s+}}/gi);

            expressions.forEach(function(expression){
                let variable = expression.match(/(\w+)/)[0];

                template = template.replace(new RegExp(expression), config.data[variable]);
            });

            return template;
        },

        /**
         * config: {
         *  data <object>
         *  props <object>
         *  template <string>
         * }
         */
        component: function(componentName, config){
            document.createElement(componentName);
            const componentInstances = convertHTMLObjectToArray(document.getElementsByTagName(componentName));

            componentInstances.forEach(element => {
                element.innerHTML = this.parseTemplate(config);
            });
        }
    }

    global.Reusable = Reusable;
})(window);
