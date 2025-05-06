import { criarUsuarios, listarUsuarios, editarUsuarios, deletarUsuario } from './crud.js';

export function setupUI() {
    // Elementos do formulário principal
    const btnCriar = document.getElementById('btnCriar');
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const nomeError = document.getElementById('nome-error');
    const emailError = document.getElementById('email-error');
    
    // Elementos do modal de edição
    const editModal = document.getElementById('editModal');
    const editNome = document.getElementById('editNome');
    const editEmail = document.getElementById('editEmail');
    const editId = document.getElementById('editId');
    const saveEdit = document.getElementById('saveEdit');
    const cancelEdit = document.getElementById('cancelEdit');
    const closeEditModal = document.getElementById('closeEditModal');
    const editNomeError = document.getElementById('edit-nome-error');
    const editEmailError = document.getElementById('edit-email-error');
    
    // Elementos do modal de confirmação
    const confirmModal = document.getElementById('confirmModal');
    const deleteId = document.getElementById('deleteId');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    
    // Elementos do toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const closeToast = document.getElementById('closeToast');
    
    // Elemento do switch de tema
    const themeToggle = document.getElementById('themeToggle');
    
    // Configuração do tema
    function setupTheme() {
        // Verificar se há uma preferência salva
        const savedTheme = localStorage.getItem('theme');
        
        // Por padrão, usar o tema escuro (não marcar o checkbox)
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.checked = true;
        }
        
        // Adicionar evento para alternar o tema
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Função para validar o formulário
    function validarFormulario(nome, email, nomeErrorEl, emailErrorEl) {
        let isValid = true;
        
        // Validar nome
        if (!nome) {
            nomeErrorEl.textContent = 'Nome é obrigatório';
            isValid = false;
        } else {
            nomeErrorEl.textContent = '';
        }
        
        // Validar email
        if (!email) {
            emailErrorEl.textContent = 'E-mail é obrigatório';
            isValid = false;
        } else if (!validarEmail(email)) {
            emailErrorEl.textContent = 'E-mail inválido';
            isValid = false;
        } else {
            emailErrorEl.textContent = '';
        }
        
        return isValid;
    }
    
    // Função para validar email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Função para mostrar toast
    function mostrarToast(mensagem, tipo = 'success') {
        toastMessage.textContent = mensagem;
        toast.className = `toast active toast-${tipo}`;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
    
    // Evento de criação de usuário
    btnCriar.addEventListener('click', () => {
        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();
        
        if (validarFormulario(nome, email, nomeError, emailError)) {
            criarUsuarios(nome, email);
            renderLista();
            inputNome.value = '';
            inputEmail.value = '';
            inputNome.focus(); // Adicionar autofocus após limpar
            mostrarToast('Usuário criado com sucesso!');
        }
    });
    
    // Eventos do modal de edição
    function abrirModalEdicao(id, nome, email) {
        editId.value = id;
        editNome.value = nome;
        editEmail.value = email;
        editNomeError.textContent = '';
        editEmailError.textContent = '';
        editModal.classList.add('active');
        
        // Adicionar um pequeno atraso para garantir que o modal esteja visível antes de focar
        setTimeout(() => {
            editNome.focus();
        }, 100);
    }
    
    function fecharModalEdicao() {
        editModal.classList.remove('active');
    }
    
    closeEditModal.addEventListener('click', fecharModalEdicao);
    cancelEdit.addEventListener('click', fecharModalEdicao);
    
    saveEdit.addEventListener('click', () => {
        const id = parseInt(editId.value);
        const nome = editNome.value.trim();
        const email = editEmail.value.trim();
        
        if (validarFormulario(nome, email, editNomeError, editEmailError)) {
            editarUsuarios(id, nome, email);
            renderLista();
            fecharModalEdicao();
            mostrarToast('Usuário atualizado com sucesso!');
        }
    });
    
    // Eventos do modal de confirmação
    function abrirModalConfirmacao(id) {
        deleteId.value = id;
        confirmModal.classList.add('active');
    }
    
    function fecharModalConfirmacao() {
        confirmModal.classList.remove('active');
    }
    
    closeConfirmModal.addEventListener('click', fecharModalConfirmacao);
    cancelDelete.addEventListener('click', fecharModalConfirmacao);
    
    confirmDelete.addEventListener('click', () => {
        const id = parseInt(deleteId.value);
        deletarUsuario(id);
        renderLista();
        fecharModalConfirmacao();
        mostrarToast('Usuário excluído com sucesso!');
    });
    
    // Evento para fechar o toast
    closeToast.addEventListener('click', () => {
        toast.className = 'toast';
    });
    
    // Função para renderizar a lista de usuários
    function renderLista() {
        const lista = document.getElementById('listaUsuarios');
        const emptyState = document.getElementById('emptyState');
        
        lista.innerHTML = '';
        
        listarUsuarios(usuarios => {
            if (usuarios.length === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
                
                usuarios.forEach(usuario => {
                    const li = document.createElement('li');
                    
                    li.innerHTML = `
                        <div class="user-info">
                            <span class="user-name">
                                <i class="ph ph-user"></i>
                                ${usuario.nome}
                            </span>
                            <span class="user-email">
                                <i class="ph ph-envelope"></i>
                                ${usuario.email}
                            </span>
                        </div>
                        <div class="user-actions">
                            <button class="btn-secondary btn-edit" data-id="${usuario.id}" data-nome="${usuario.nome}" data-email="${usuario.email}">
                                <i class="ph ph-pencil"></i>
                                Editar
                            </button>
                            <button class="btn-danger btn-delete" data-id="${usuario.id}">
                                <i class="ph ph-trash"></i>
                                Excluir
                            </button>
                        </div>
                    `;
                    
                    lista.appendChild(li);
                });
                
                // Adicionar eventos aos botões de editar e excluir
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = parseInt(btn.getAttribute('data-id'));
                        const nome = btn.getAttribute('data-nome');
                        const email = btn.getAttribute('data-email');
                        abrirModalEdicao(id, nome, email);
                    });
                });
                
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = parseInt(btn.getAttribute('data-id'));
                        abrirModalConfirmacao(id);
                    });
                });
            }
        });
    }
    
    // Adicionar eventos para teclas de atalho
    document.addEventListener('keydown', (e) => {
        // Fechar modais com ESC
        if (e.key === 'Escape') {
            if (editModal.classList.contains('active')) {
                fecharModalEdicao();
            }
            if (confirmModal.classList.contains('active')) {
                fecharModalConfirmacao();
            }
        }
        
        // Enviar formulário com Enter
        if (e.key === 'Enter') {
            if (document.activeElement === inputNome || document.activeElement === inputEmail) {
                btnCriar.click();
            }
            
            if (editModal.classList.contains('active') && 
                (document.activeElement === editNome || document.activeElement === editEmail)) {
                saveEdit.click();
            }
        }
    });
    
    // Inicializar o tema
    setupTheme();
    
    // Inicializar a lista
    renderLista();
    
    // Expor funções para uso global (não mais necessário com os modais)
    window.editar = () => {}; // Mantido para compatibilidade
    window.excluir = () => {}; // Mantido para compatibilidade
}