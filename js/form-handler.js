/**
 * Inicializa a submissão de um formulário para uma tabela do Supabase.
 * @param {string} formId - O ID do formulário (ex: 'lead-form')
 * @param {string} tableName - O nome da tabela no Supabase (ex: 'leads')
 * @param {Function} dataMapper - Função opcional para mapear os campos do FormData para o objeto final
 */
function setupSupabaseForm(formId, tableName, dataMapper = null) {
    const form = document.getElementById(formId);
    if (!form) return;

    if (!window.supabaseClient) {
        console.error('Supabase client não está inicializado. Verifique a configuração.');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('form-success') || document.querySelector('.form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validação adicional de campos obrigatórios
        const requiredElements = form.querySelectorAll('[required]');
        let isValid = true;
        requiredElements.forEach(el => {
            if (!el.value.trim()) {
                isValid = false;
                el.style.borderColor = 'red';
            } else {
                el.style.borderColor = ''; // Reseta o estilo
            }
        });

        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
        }

        const formData = new FormData(form);
        let data = {};
        
        if (dataMapper) {
            data = dataMapper(formData);
        } else {
            // Mapeamento padrão, pega todos os campos pelo name=""
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
        }

        try {
            const { error } = await window.supabaseClient
                .from(tableName)
                .insert([data]);

            if (error) {
                console.error(`Erro retornado pelo Supabase (tabela: ${tableName}):`, error);
                if (error.code === '42P01') {
                    alert('Erro: A tabela "' + tableName + '" não existe no Supabase. Por favor, crie-a no painel do Supabase com as colunas necessárias.');
                } else {
                    alert('Erro ao enviar os dados. Verifique a configuração e tente novamente.');
                }
                throw error;
            }

            // Sucesso
            form.reset();
            form.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'flex';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } catch (error) {
            console.error(`Falha na inserção do formulário ${formId}:`, error);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText;
            }
        }
    });
}

// Inicializa os formulários da página
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o form de contatos usando o script reutilizável
    setupSupabaseForm('lead-form', 'leads', (formData) => {
        // Função de mapeamento que garante que os dados enviados ao banco
        // tenham os nomes exatos de colunas esperados (name, email, phone, message).
        
        // Mapeamos os names originais do HTML para os formatos solicitados
        const solucoes = formData.getAll('solucoes');

        // Retorna exatamente as colunas definidas no banco de dados
        return {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            empresa: formData.get('empresa'),
            mensagem: formData.get('mensagem'),
            solucoes: solucoes ? solucoes.join(', ') : ''
        };
    });
});
