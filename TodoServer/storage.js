module.exports = {

    'tarefas' : [
        {
            "id" : 1,
            "usuario_id" : 1,
            "texto" : 'Tarefa Server 1',
            "data" : new Date(),
            "feita" : false
        },
        {
            "id" : 2,
            "usuario_id" : 1,
            "texto" : 'Tarefa Server 2',
            "data" : new Date(),
            "feita" : false
        },
        {
            "id" : 3,
            "usuario_id" : 2,
            "texto" : 'Tarefa Server 3',
            "data" : new Date(),
            "feita" : false
        }
    ],
    'usuarios' : [
        {
            'id' : 1,
            'nome' : 'Fulano',
            'email' : 'fulano@email.com',
            'senha' : '123456'
        },
        {
            'id' : 2,
            'nome' : 'Ciclano',
            'email' : 'ciclano@email.com',
            'senha' : '123456'
        }
    ]
}