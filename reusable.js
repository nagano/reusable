(function(global){
    const document = global.document;

    function convertHTMLObjectToArray(type, componentName){
        let HTMLObject

        switch(type){
            case 'getElementsByTagName':
                HTMLObject = document.getElementsByTagName(componentName);
                break;
            case 'querySelectorAll':
                HTMLObject = document.querySelectorAll(componentName);
                break;
            default:
                HTMLObject = [];
        }

        return [].slice.call(HTMLObject);
    }

    const Reusable = {
        parseTemplate: function(element, config){
            let template = config.template;
            let props = config.props;
            let data = config.data;

            const expressions = template.match(/{{\s+\w+\s+}}/gi);
            expressions.forEach(function(expression){
                let variable = expression.match(/(\w+)/)[0];
                template = template.replace(new RegExp(expression), replaceVarInTemplate(variable));
            });

            function replaceVarInTemplate(variable){
                if(data && variable in data){
                    return data[variable];
                }

                if(props){
                    let attributeValue = element.attributes[variable].value;

                    if(props[variable] === '@'){
                        return attributeValue;
                    } else if(props[variable] === '='){
                        return global[attributeValue];
                    } else {
                        return ' ';
                    }
                }
            }

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
            document.createElement(componentName); // required by older browsers
            const componentInstances = convertHTMLObjectToArray('getElementsByTagName', componentName);

            componentInstances.forEach(element => {
                element.innerHTML = this.parseTemplate(element, config);
                declareBuiltInDirectives(config.data);
            });
        }
    }

    function declareBuiltInDirectives(scope){
        scope = scope || global;

        const reuseIf = convertHTMLObjectToArray('querySelectorAll', '[reuse-if]')
        reuseIf.forEach(function(element){
            let attributeValue = element.attributes['reuse-if'].value;

            setTimeout(function(){
                let condition = scope[attributeValue];
                if(!condition){
                    element.style.display = 'none';
                }
            }, 0)
        });
    }

    declareBuiltInDirectives();

    global.Reusable = Reusable;
})(window);
