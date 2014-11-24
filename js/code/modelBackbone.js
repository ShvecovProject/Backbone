/**
 * Created by Shvecov on 20.10.2014.
 */
var backbone = Backbone||{};

//<editor-fold desc="Models">
var Todo = backbone.Model.extend({
    defaults:{
      title:'',
      completed:false
    },
    initialize: function(){
     console.log('This model has been initialized.');
    }
});

var todo = new Todo({});

console.log("todo: " + JSON.stringify(todo));

var todo2 = new Todo({
    title: 'Check the attr of both model instances in the console.',
    completed: true
});
console.log("todo2:" + JSON.stringify(todo2));

console.log("Title: " + todo.get('title'));
console.log("Title: " + todo2.get('title'));

todo2.set({
    title:"Changed title todo2",
    completed:true
});

todo.set("title","Changed title todo");

console.log("Changed todo :" + JSON.stringify(todo));
console.log("Changed todo2:" + JSON.stringify(todo2));

todo.set("completed",true,{silent:true}); //{silent:true} - полностью глушит отдельные события change:attr

/*
Для получения уведомлений об изменении модели нужно связать с ней слушателя событий, генерируемых при ее создании. Добавлять это удобно в функции initialize()
 */
//<editor-fold desc = 'Прослушивание изменений модели'>
var model = Backbone.Model.extend({
    defaults:{
        title: "Title",
        completed: false
    },
    initialize:function(){
        console.log("Initialize model");
        this.on('change',function(){
           console.log('-Values fot this model have changed');
        });
    }
});

var myModel = new model();
console.log('Model not changed:' + JSON.stringify(myModel));
myModel.set("title","My model Title");
myModel.set('completed', true);
console.log('changed Model:'+ JSON.stringify(myModel));

//можно прослушивать отдельные аттрибуты модели

var modelEventChangeOnSelectAttr = Backbone.Model.extend({
   defaults:{
      defaults:{
          title: "default_title",
          completed: false
      }
   },
   initialize:function(){
       this.on("change:title", function(){
          console.log("Change Title");
       });
    },
    setTitle: function( newTitle )
    {
        this.set( {title: newTitle} );
    }
});
console.log('Create model and set attr');
var modelEventChange = new modelEventChangeOnSelectAttr({
    title:"Change Title"
});
console.log('-------------change on set method------------------');

modelEventChange.set('title',"change title Set")

console.log("Change title on method setTitle");
modelEventChange.setTitle("New Title");

console.log('Change completed');
modelEventChange.set('completed',true);

//</editor-fold>

//<editor-fold desc = 'Validation'>
/* обеспечивает валидацию модели с помошью метода model.validate() который позволяет проверять значение аттр перед установкой по умолчанию
валидация выпорлняеться при сохранении модели методом save || set() c аргументом {validate:true}
*/
console.log('------------------------------------------------------------------------------------------------------------------------------');
var User = new Backbone.Model({
    name: 'Jeremmy'
});

User.validate = function(attr){
    console.log("Validation proc");
    if(!attr.name){
        return 'Please, enter name!'
    }
    console.log("Finished validation proc");
};
/*var user1 = new User();
user1.set('name',"User1");*/
//console.log(JSON.stringify(User));
User.set({name:'Evgeniy'},{validate:true});
console.log(User.get('name'));
User.unset('name',{validate:true}); // удалят параметр из модели
console.log(JSON.stringify(User));

console.log('_______________________________________________________________________');

var ValidationExModel = Backbone.Model.extend({
   defaults:{
       completed: false
   },
   validate: function(attr){
      if(attr.title === undefined){
          return 'Remember to set a title for your todo.'
      }
    },
   initialize: function(){
      console.log('init');
      this.on('invalid', function(model, error){
          console.log(error);
      });
   }
});
var models = new ValidationExModel();
models.set('completed',true,{validate:true});

//</editor-fold>

//</editor-fold>


//<editor-fold desc="Views">
/*
  Представления в Backbone не содержит html разметки. Они включают логику отображения данных моделей пользователю
  Для этой цели используют шаблоны JS.(Underscore.js). Метод render()представления можно связать с событием change() модели
  это дает возможность немедленно отображать изменения модели без повторного обновления страницы
*/
var TodoView = Backbone.View.extend({
   tagName:'li',
    //кеширование функции шаблона для отдельного элемента
   todoTpl: _.template("An example template"),
   events:{
    'dblclick label':'edit',
    'keypress .edit':'updateOnEnter',
    'blur .edit':'close'
   },
   render: function(){
       this.$el.html(this.todoTpl(this.model.toJSON())); // это ссылка на DOM элемент
       this.input = this.$('.edit');
       return this;
   },
    edit:function(){

    },
    close:function(){

    },
    updateOnEnter: function(e){

    }
});

var view = new TodoView();
console.log(view.el);

/*
el - ссылка на DOM элемент, п помошью свойства el  представления могут формировать содержимое своего элемента. А потом одним приемом ставляеть его в
 DOM.
Существет 2 способа связать DOM с представлением. 1) создать для представления новый элемент и затем добавить его в DOM.
                                                  2) создать ссылку на уже существующий элемент страницы
 Если нужно создать новый элемент для представления, нужно задать любое сочетание из следующих св-в представления:
                                                     tagName, id, class name
 Фреймворк создаст новый элемент, ссылка на который будет доступна в св-ве el. Если ничего не задано, то tagName по умолчанию div


 */

var TodosView = Backbone.View.extend({
   tagName: 'ul',
   className: 'container',
   id: 'todos'
});
var todos = new TodosView();
console.log(todos.el);

// задание свойств el при создании представления
console.log("--");
var todose =new Backbone.View({el: $('#footer')});
console.log(todose.$el);
// Свойство view.$el ==$(view.el), view.$(selector)== $(view.el).find(selector)

    //<editor-fold desc="--SetElement">
    //------------------------------------------------------------------------------SetElement-----------------------------
    /*Для применнения существующего представления к другому DOM элементу нужно воспольз методом SetElement
     Переопределение свойства this.el должно одновременно изменя ссылку на элемент и заново привязать события к новому элементу(отключать от старого).
     Метод SetElement создаст кэшированную ссылку $el переместив переданные события из старого элемента в новый
     */
    var button1 = $('<button></button>');
    var button2 = $('<button></button>');
    var View = Backbone.View.extend({
       events:{
           click:function(e){
               console.log(view.el === e.target);
           }
       }
    });
    var view = new View({el:button1});
    view.setElement(button2);
    button1.trigger('click');
    button2.trigger('click');
    //</editor-fold>
    //<editor-fold desc="Render">
      /*
       Render - дополнительная функция, определяющая логику отображения шаблона.
       Метод _.template библеотеки Underscore компилирует JS шаблоны в функции, которые могут вызываться при выполнении отражения.
       Метод render передает шаблоны фттрибуты модели, связанные с представлением в формате toJson(). Шаблон возвращает свою разментку
       после оценки выражений, содержащих заголовок модели и флаг завершения задачи.Потом передается эта разметка в кчестве HTML содержимого
       Dom элемнта el c помошью свойства $el.

       В Backbone в конце функции render() принято возвращать указатель this. Это удобно по таким причинам как:
            1)представления можно использовать многократно в других родительских представлениях
            2) можно создать список элементов, не прибегая к отображению и отрисовке каждого элемента в отдельности, а затем
            единовременно отобразить весь список после его заполнения
       */
    var models = new Todo({
        completed:true,
        title:'Evgeniy'
    });

    var arrayModel = backbone.Model.extend({
        items:[],
      /*  defaults:{
            items:[]
        },*/
        addToArray:function(model){
            this.items.push(model);
        }
    });

    var ItemView = Backbone.View.extend({
      events:{},
      render: function(){
       this.$el.html(this.model.toJSON());
          return this;
      }
    });

   var todoView = Backbone.View.extend({
       tagName:'li',
       todoTpl: _.template($('#item-template').html()),
        events:{
            'dblclick label':'edit'
        },
        initialize:function(){
          this.$el = $('#todo');
        },
        render:function(){
            var items = this.model.get('items');
            _.each(items, function(item){
                var itemView = new ItemView({model:item});
                this.$el.append(itemView.render().el);
            }, this);
           // this.$el.html(this.todoTpl(this.model.toJSON()));
          //  this.input = this.$('.edit');
            return this;
        },
        edit:function(){

        }
    });


       var arra = new arrayModel();
        arra.addToArray(models);
    var todo = new todoView({model:arra});
    todo.render();
    //</editor-fold>
//</editor-fold>
