// CONFIRM DELET
function confirmDelet(event, form) {
    event.preventDefault() // Impedir que o formulario seja submetido
    let decision = confirm('Deseja deletar?')
    if(decision == true) {
        form.submit()
    } else {
        console.log('Não quero deletar, foi um acidente')
    }
}

