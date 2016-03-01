
var conf = {
	'environment':'dev',
	'version':'1.0.5', 
	'passPhrase':'8c83eaf2790dd0f6729709815e0f11f8',
	'dev' : {
		'url':'http://192.168.1.102',
		'port':':3000'
	},
	'prd' : {
		'url':'http://back.ntvc.tv',
		'port':':3000'
	},
	'hom' : {
		'url':'http://192.168.1.102',
		'port':':3001'
	},
	'folder' : {
		'api':'/dbox'
	}

};

var environment = {
	'api':conf[conf.environment].url+conf[conf.environment].port+'/dbox',
	'imagesPath':conf[conf.environment].url+conf[conf.environment].port+'/'
};

var GoliveJSON = { 
	DBox: { 
    	Query: 	{ 'nexturl'	:'' }, 
    	Test:   { 'validate':'4f2064bfc195dbd3||D-BoxD110||78:44:76:f5:d4:fd||04:e6:76:75:42:28' },
    	Device: { 'validate':'' }
	}
};

//Default - test
//Device - prod
var validate = GoliveJSON.DBox.Device.validate;
