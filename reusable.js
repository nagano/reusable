(function(global){
    const document = global.document;

    function convertHTMLObjectToArray(componentName){
        let HTMLObject = document.getElementsByTagName(componentName)
        return [].slice.call(HTMLObject);
    }

    const Reusable = {
        parseTemplate: function(element, config){
            let template = config.template;
            let props = config.props;
            let data = config.data;

            function replaceVarInTemplate(variable){
                if(data && variable in data){
                    return data[variable];
                }

                if(props){
                    let attributeValue = element.attributes[variable].value;
                    switch(props[variable]){
                        case '@':
                            return attributeValue;
                            break;
                        case '=':
                            return global[attributeValue];
                            break;
                        default:
                            console.log('none');
                    }
                }
            }

            const expressions = config.template.match(/{{\s+\w+\s+}}/gi);

            expressions.forEach(function(expression){
                let variable = expression.match(/(\w+)/)[0];
                template = template.replace(new RegExp(expression), replaceVarInTemplate(variable));
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
            const componentInstances = convertHTMLObjectToArray(componentName);

            componentInstances.forEach(element => {
                element.innerHTML = this.parseTemplate(element, config);
            });
        }
    }

    global.Reusable = Reusable;
})(window);
