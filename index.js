
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {

        Ext.override(Ext.data.Model,{
            validate: function() {
                var errors      = new Ext.data.Errors(),
                   validations = this.validations,
                   validators  = Ext.data.validations,
                   length, validation, field, valid, type, i;
                if (validations) {
                   length = validations.length;
                   
                   for (i = 0; i < length; i++) {
                       validation = validations[i];
                       field = validation.field || validation.name;
                       type  = validation.type;
                       valid = validators[type](validation, this.get(field),this);
                       
                       if (!valid) {
                           errors.add({
                               field  : field,
                               message: validation.message || validators[type + 'Message']
                           });
                       }
                   }
                }
               
               return errors;
            }
        });
    
        Ext.apply(Ext.data.validations,{
            passwordMessage: 'Password Mismatch',
            password: function(config, value,formData) {
                if(formData.data.confirmpassword == formData.data.password){
                    return true;
                } else {
                    return false;
                }
            }
        });
        
        Ext.regModel('User', {
            fields: [
                {name: 'name',     type: 'string'},
                {name: 'password', type: 'password'},
                {name: 'email',    type: 'string'},
                {name: 'confirmpassword',    type: 'string'}
            ],
            validations: [
                {type:  'presence', name: 'name',message:"Enter Name"},
                {type:  'presence', name: 'password', message : "Enter Password"},
                {type:  'format',   name: 'email', matcher: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message:"Wrong Email Format"},
                {type : 'password', name:'password'}
            ]
        });
        
        var formBase = {
            scroll: 'vertical',
            url   : 'postUser.php',
            standardSubmit : false,
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Personal Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        required: true,
                        labelAlign: 'left',
                        labelWidth: '40%'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        name : 'name',
                        label: 'Name',
                        useClearIcon: true,
                        autoCapitalize : false
                    }, {
                        xtype: 'passwordfield',
                        name : 'password',
                        label: 'Password',
                        useClearIcon: false
                    },{
                        xtype: 'passwordfield',
                        name : 'confirmpassword',
                        label: 'Confirm Password',
                        useClearIcon: false
                    }, {
                        xtype: 'emailfield',
                        name : 'email',
                        label: 'Email',
                        placeHolder: 'you@sencha.com',
                        useClearIcon: true
                    }]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            text: 'Load Model',
                            ui: 'round',
                            handler: function() {
                                formBase.user = Ext.ModelMgr.create({
                                    'name'    : 'Akura',
                                    'password': 'secret',
                                    'confirmpassword': 'secret',
                                    'email'   : 'saru@sencha.com'
                                }, 'User');
        
                                form.loadModel(formBase.user);
                            }
                        },
                        {xtype: 'spacer'},
                        {
                            text: 'Reset',
                            handler: function() {
                                form.reset();
                            }
                        },
                        {
                            text: 'Save',
                            ui: 'confirm',
                            handler: function() {
                                var model = Ext.ModelMgr.create(form.getValues(),'User');
                                
                                var errors = model.validate(),message = "";
                                if(errors.isValid()){
                                    
                                    if(formBase.user){
                                    form.updateRecord(formBase.user, true);
                                    }
                                    form.submit({
                                        waitMsg : {message:'Submitting', cls : 'demos-loading'}
                                    });
                                    
                                } else {
                                    Ext.each(errors.items,function(rec,i){
                                        message += rec.message+"<br>";
                                    });
                                    Ext.Msg.alert("Validate", message, function(){}).doComponentLayout();
                                    return false;
                                }
                            }
                        }
                    ]
                }
            ]
        };
        
        if (Ext.is.Phone) {
            formBase.fullscreen = true;
        } else {
            Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
                centered: true,
                hideOnMaskTap: false,
                height: 385,
                width: 480
            });
        }
        
        form = new Ext.form.FormPanel(formBase);
        form.show();
    }
});