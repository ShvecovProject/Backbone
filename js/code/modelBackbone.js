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
      /* defaults:{
            items:[]
        },*/
        addToArray:function(model){
            this.items.push(model.toJSON());
            return this;
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

//<editor-fold desc="Events Collections and all">
/*
  Набор событий позволяет подключать слушателей событий к селекторам, связанным с элементом el. Либо напрямую к элементу el при
  отсутствии селектора. Собитие имеет вид пары значения. 'Имя_события селектор':'Функция обратного вызова'.
  Backbone поддерживает различные типы дом событий.

  Коллепкции представляют собой множества моделей и создаются путем расширения класса Backbone.Collection

 */
var Todo = Backbone.Model.extend({
   defaults:{
       title:'',
       completed:false,
       status:''
   }
});
var TodosCollections = Backbone.Collection.extend({
   model:Todo
});
var myTodo = new Todo({title:'Read the book', id:2});
var todos = new TodosCollections([myTodo]);
console.log(todos.length);
// Добавление и удаление моделей
var a = new Todo({title:"Item 1"}),
    b = new Todo({title:"Item 2"}),
    c= new Todo({title:"Item 3"});
todos.add(a);
todos.add(b);
todos.remove(c);
console.log(todos.length);
todos.remove(a);
console.log(todos.length);

//есть огперация merge при добавлениии с одинаковыми id элементами

//Считывание моделей
/*
Существует несколько способов считывания модели с коллекции .
В клиен серверных приложениях коллекции содержат модели, считываемые с сервера. При обмене данными между клиентом и сервером
необходимо уникальным образом идентиф. модели. Для этого в Backbone используются свойства id, cid, idAttribute
Каждая модешь имеет уникальных идентификатор id, который является целым числом или строкой. У моделей также есть клиентский
индентификатор cid, автоматически генерируемый библиотекой Backbone при создании модели. Для считывания модели можно использовать любой из идентификаторов

Основное отличие между этими идентификаторами в том что cid генерируется библиотекой, это может оказатся убодным при отсутствии настоящего id
Аттрибут idAttribute идентифицирует модель возвращаемую сервером. Это указывает билиотеке какое поле данных сервера должно использоватся
для заполнения свойствва id. По умолчанию используется поле id. Например если сервер создает аттрибут можеди с именем userId то в определении
модели можно установить idAttribute = userId
 */


if(todos.get(2) == myTodo)
{
    console.log("Obj ==");
}

//Прослушивание событий. Поскольку коллекции представляют собой группы элементов мы можем прослушивать события add, remove, которые происходят
// при добавлении\удалении  элементов в коллекцию

todos.on('add',function(todo){
    console.log('We add new model to collection ');
    console.log(todo);

});
todos.add(c);
//Можно прослушивать изменения свойств модели в коллекции
todos.on('change:title', function(todo){
    console.log('Whe are chenged title in model');
});

var vModel = todos.get(2);
vModel.set('title', "New Title");

//Улучшенный пример
todos.on({
   'change:complete': changeComplete,
    'chanhe:status': changeStatus
});
function changeComplete(){

};
function changeStatus(){

};

//Перезапись и обновление коллекций
var updateCollection = new Backbone.Collection();
updateCollection.on(["add",function(model){
   console.log('Add new Item');
},
    "remove",function(model){
   console.log('Remove Items');
},
    "change:completed",function(model){
      console.log('Change Completed property');
    }
]);
updateCollection.add([
    {id:1, title:"Item 1", completed: false},
    {id:2,title:"Item 2 ", completed: false},
    {id:3, title:"Item3",completed:false}
]);

updateCollection.set([
{id:1, title:"Item 1 1", completed:true},
//{id:2,title:"Item 2 ", completed: false},
{id:4, title:"Item4",completed:false}
]);

 //</editor-fold>

//<editor-fold desc = 'Underscore'>
//forEach
updateCollection.set([
    {id:1, title:"Item 3", completed: true},
    {id:2,title:"Item 1", completed: true},
    {id:3, title:"Item 5",completed:false},
    {id:4, title:"Item 2", completed: true},
    {id:5,title:"Item 4", completed: false},
    {id:6, /*title:"Item 6",*/completed:true}
]);
updateCollection.forEach(function(model){
    if(model.get('title')) {
        console.log(model.get('title'));
    }
});

//sortBy
var  sortByAlphabet = updateCollection.sortBy(function(todo) {
    if (todo.get('title')) {
        return todo.get('title').toLowerCase();
    }
});
    console.log('__________________________________________________________');
    sortByAlphabet.forEach(function(model) {
        if (model.get('title')) {
            console.log(model.get('title'));
        }
    });
//map()
var count  = 1;
console.log(updateCollection.map(function(model){
    return count++ +". " + model.get('title');
}));
//Min Max

console.log(updateCollection.max(function(model){
   return model.id;
}).id);

console.log(updateCollection.min(function(model){
    return model.id;
}).id);
// извлечение с коллекции заданного аттрибута

var titles = updateCollection.pluck('title');
titles.forEach(function(item){
   console.log(item);
});

//</editor-fold>
//</editor-fold>

//Считывание моделей с сервера
var TodosServ = backbone.Model.extend({
   defaults:{
       title:"",
       completed:false
   }
});
var TodosCollectionServ = backbone.Collection.extend({
   model:TodosServ,
    url:'/todos'
});

var todosServ = new TodosCollectionServ();
todosServ.fetch(); //посылает запрос Http get по адресу /todos

//Сохранение моделей на сервер
/*
Обновления моделей выполняется индивидуально с помошью метода save() модели. Когда метод save вызывается у модели которая была
считана с сервера он формирует URL добавляя id модели к URL коллекции и посылает серверу запрос HTTP PUT
Если новая модель - которя была созана в дбаузере у него нет id. то запрос HTTP POST посылается по адрессу URL коллекции
Можно создать новую модель добавить ее в коллекцию и отправить на сервер с помошью вызова Collections.create().
 */

var RestFullExample = backbone.Model.extend({
   defaults:{
       title:"",
       completed:false
   }
});
var TodosCollectionRestFull = backbone.collection.extend({
   model:Todo,
    url:'/todo'
});
var restFullObj = new TodosCollectionRestFull();
restFullObj.fetch();
var todo2RestFull = restFullObj.get(2);
todo2RestFull.set('title','go fishing');
todo2RestFull.save();

todo2RestFull.destroy();//false
todo2RestFull.create({title:'Try out code samples'});

//Удаление моделей с сервера
todo2RestFull.destroy(); //посылает запрос HTTP delete по адресу /todo/2 и удаляет модель из коллекции

// вызов destroy возвращает значение false если у модели установлен флаг isNew

//Параметры
/*
Каждый метод принимает параметры, олнако важнее всего то что методы позволяют указывать обратные вызовы, обрабатывающие
успешные и неуспешние операции, которые можно использовать для настройки обработки ответов сервера
 При передаче параметра {patch:true} методу Model.save(attrs,{patch:true}) он использует запрос HTTP PATCH, что бы отправить
  только измененные атрибуты, а не модель целиком
 */
//События
/*
Класс Backbone.Events входит в состав ряда других классов Backbone
Backbone
Backbone.Model
Backbone.Collection
Backbone.Router
Backbone.History
Backbone.View
-------------------------------------------------------------------------------------------------
on(), off() trigger()

Класс Backbone.Events дает любому обьекту возможность осуществлять привязку и генерацию произвольных событий.
Можно легко включить этот модуль в любой обьект, при этом события не обязательно обьявлять раньше чем они привязываются
к обработчику обратного вызова

var ourObject={};
_.extend(ourObject, Backbone.Events);
ourObject.on('dance',function(msg){
       console.log('We triggered'+msg);
});
ourObject.trigger('dance','our event');
Метод on привязывает функцию обратного вызова к обьекту.
Обратный вызов наступает каждый раз при генерации события.
Необходимо использовать пространства имен событий с двоеточиями, если на странице есть хотя бы несколько событий

 */
var ourObj = {};
_.extend(ourObj, Backbone.Events);
function dancing (msg){
    console.log("We started"+msg); // функц
}
ourObj.on("all",function(eventName){
   console.log("The name of the event passed was "+ eventName);   // будем слушать каждое событие которое наступает
});
ourObj.on("dance:tap",dancing); // подписали событие на обработчик
ourObj.on("dance:break",dancing);// подписали событие на обработчик

ourObj.trigger("dance:tap","tap dancing"); // генерируем событие
ourObj.trigger("dance:break","break dancing");// генерируем событие

ourObj.trigger("dance","test");