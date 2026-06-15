async function obterDadosCep(cep) {
    const padraoCep = /^\d{8}$/;
    const cepError = document.querySelector("#cepError");

    if (!padraoCep.test(cep)) {
        cepError.classList.remove('hidden');
        throw new Error('CEP inválido');
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
        throw new Error('Erro na requisição');
    }

    return await response.json();
}

async function atualizarFormulario() {
    const cep = document.querySelector("#cep");
    const stree = document.querySelector("#street");
    const number = document.querySelector("#number");
    const neighborhood = document.querySelector("#neighborhood");
    const state = document.querySelector("#state");
    const city = document.querySelector("#city");
    const cepError = document.querySelector("#cepError");
    
    try {
        stree.value = '';                
        neighborhood.value = '';
        state.value = '';
        city.value = '';
        cepError.className = 'hidden';

        const cepInformado = cep.value;
        const dadosCep = await obterDadosCep(cepInformado);

        if (!dadosCep.cep) {
            cepError.classList.remove('hidden');
            throw new Error('CEP inexistente');
        }

        stree.value = dadosCep.logradouro;
        neighborhood.value = dadosCep.bairro;
        state.value = dadosCep.uf;
        city.value = dadosCep.localidade;
    }
    catch (error) {
        number.value = '';
        console.log(error);
    }
}

document.addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        atualizarFormulario();
    }
});