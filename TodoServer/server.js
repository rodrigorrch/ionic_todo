/**
 * Aplicação server desenvolvida para o curso:
 * "Criando aplicativos móveis híbridos com Ionic/Cordova"
 * @url: http://www.dezani.com.br/dezani/criando-aplicativos-moveis-usando-ionic-cordova
 * @author: Professor Dr. Henrique Dezani
 * @date: 26 de julho de 2016
 */

var express = require('express');
var http = require('http');
var storage = require('./storage');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var app = express();

/**
 * DEFINE AS VARIÁVEIS DO AMBIENTE
 */

/**
 * Variável do ambiente relacionada à porta que será executada a aplicação.
 */
app.set('port', 3004);

/**
 * Variável do ambiente relacionada à chave secreta para gerar/validar o token.
 */
app.set('SECRET_KEY', 'estaeachavesecreta');

/**
 * DEFINE OS MIDDLEWARES
 */

/**
 * Realiza a conversão automática de dados no formato json para objeto "body".
 */
app.use(bodyParser.json())

/**
 * DEFINE AS ROTAS E AS REGRAS DE NEGÓCIO
 */ 

/**
 * Método para permitir o acesso de outras origens (CORS):
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

/**
 * Método intermediário para validar acesso
 */
var validaAcesso = function (req, res, next) {
    
  // recupera o token do cabeçalho da requisição (header):
  var token = req.get('Authorization');
  
  if(token != undefined) {

      try {
        
        // retorna o token aos dados originais (a partir da chave privada):
        // var decoded = jwt.verify(token, app.get('SECRET_KEY'));
        jwt.verify(token, app.get('SECRET_KEY'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Falha na autenticação do token.' });    
            } else {   
                // caso seja decodificado com sucesso, continua o processamento da requisição:
                next();
            }
        });
        
      } catch(err) {
          
          // caso token seja inválido, retorna status 401 (não autorizado):
          return res.status(401).send();
      }
  }
  else {
      
    // caso não haja token, retorna status 401 (não autorizado):
    return res.status(401).send();
  }  
};

/**
 * Retorna a lista de todas as tarefas.
 * HTTP GET /api/tarefa
 */
app.get('/api/tarefa', validaAcesso, function(req, res) {
    res.status(200).json(storage.tarefas);
});

/**
 * Retorna uma tarefa pelo seu id.
 * @param id - Id da Tarefa
 * HTTP GET /api/tarefa/5
 */
app.get('/api/tarefa/:id', function(req, res) {
    for(var i = 0; i < storage.tarefas.length; i++) {
        if(storage.tarefas[i].id == req.params.id) {
            return res.status(200).json(storage.tarefas[i]);
        }
    }
    res.status(404).json({});
});

/**
 * Insere uma nova tarefa.
 * @param json - Dados da tarefa
 * HTTP POST /api/tarefa
 */
app.post('/api/tarefa', function(req, res) {
    
    var tarefa = {
        "id" : new Date().getTime(),
        "texto" : req.body.texto,
        "data" : new Date(),
        "feita" : false
    }
    
    storage.tarefas.push(tarefa);
    res.status(204).send();
});

/**
 * Atualiza uma tarefa pelo seu id.
 * @param id - Id da Tarefa
 * @param json - Dados da Tarefa
 * HTTP PUT /api/tarefa/5
 */
app.put('/api/tarefa/:id', function(req, res) {
    for(var i = 0; i < storage.tarefas.length; i++) {
        if(storage.tarefas[i].id == req.params.id) {
            storage.tarefas[i].texto = req.body.texto;
            
            if(req.body.feita != undefined) 
                storage.tarefas[i].feita = req.body.feita;
                
            return res.status(204).send();
        }
    }
    
    res.status(404).send();
});

/**
 * Apaga uma tarefa pelo seu id.
 * @param id - Id da Tarefa
 * HTTP DELETE /api/tarefa/5
 */
app.delete('/api/tarefa/:id', function(req, res) {
    for(var i = 0; i < storage.tarefas.length; i++) {
        if(storage.tarefas[i].id == req.params.id) {
            storage.tarefas.splice(i,1);
            return res.status(204).send();
        }
    }
    res.status(404).send();
});

/**
 * Retorna o token de um usuário ao efetuar o login.
 * @param email - Email do Usuário
 * @param senha - Senha do Usuário
 * HTTP POST /api/usuario
 */
app.post('/api/usuario', function(req, res) {
    
    for(var i = 0; i < storage.usuarios.length; i++) {
        if(storage.usuarios[i].email == req.body.email && 
                storage.usuarios[i].senha == req.body.senha) {
            
            var token = jwt.sign(storage.usuarios[i], app.get('SECRET_KEY'), {
                expiresIn: '10000'
            });
            
            return res.status(200).json({nome: storage.usuarios[i].nome, token: token});
        }
    }
    
    return res.status(401).send();   
    
})

/**
 * Inicia o servidor:
 */
http.createServer(app).listen(app.get('port'), function() {
    console.log('Aplicação nodejs carregada na porta ' + app.get('port'));
});