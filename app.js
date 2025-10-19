// 1. Importar o cliente Supabase do CDN (ESM Module)
// (Isso substitui todas as importações do Firebase)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- ATENÇÃO: PASSO OBRIGATÓRIO ---
// Cole suas chaves do Supabase aqui
// Você encontra em: Dashboard > Project Settings > API
const SUPABASE_URL = 'https://SEU-PROJETO-ID.supabase.co';
const SUPABASE_KEY = 'SUA-CHAVE-ANON-PUBLIC';
// ----------------------------------------------------

// 2. Inicializa o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Seleciona os elementos do DOM (exatamente como no seu arquivo original)
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const githubBtn = document.getElementById('github-login-btn');
const forgotPasswordLink = document.getElementById('forgot-password');
const errorMessage = document.getElementById('error-message');
const signupLink = document.querySelector('.signup-link'); // Adicionei este seletor

// --- PASSO 5 (Atualizado): Login com Email e Senha ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = ''; // Limpa erros antigos

    // Usa a função de login do Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error('Erro no login:', error.message);
        errorMessage.textContent = getFriendlyErrorMessage(error.message);
    } else {
        console.log('Login bem-sucedido!', data.user);
        // Redireciona para sua página de coleções
        window.location.href = 'https://alemedcolecoes.github.io/maisto-fresh-metal/';
    }
});

// --- PASSO 5 (Atualizado): Login com GitHub ---
githubBtn.addEventListener('click', async () => {
    errorMessage.textContent = '';

    // Usa a função de login OAuth do Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
    });
    
    if (error) {
        console.error('Erro no login com GitHub:', error.message);
        errorMessage.textContent = getFriendlyErrorMessage(error.message);
    }
    // Para OAuth, o Supabase cuida do redirecionamento
    // (veja o Passo 2 de Configuração abaixo)
});

// --- PASSO 5 (Atualizado): Recuperar Senha ---
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value;

    if (!email) {
        errorMessage.textContent = 'Por favor, digite seu e-mail para recuperar a senha.';
        return;
    }
    errorMessage.textContent = 'Enviando...'; // Feedback para o usuário

    // Usa a função de reset de senha do Supabase
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        // Para onde o usuário deve ser levado após clicar no link do e-mail
        redirectTo: window.location.origin + window.location.pathname.replace('index.html', '') 
    });

    if (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);
        errorMessage.textContent = getFriendlyErrorMessage(error.message);
    } else {
        errorMessage.textContent = '';
        alert('E-mail de recuperação de senha enviado! Verifique sua caixa de entrada.');
    }
});

// --- (Bônus) Link de Cadastro ---
// O seu HTML tem um link "Ainda não tenho uma conta"
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Você precisará criar uma página 'signup.html' separada
    // O código nela será quase idêntico a este, mas usará 'supabase.auth.signUp()'
    alert('Esta ação deve levar para uma página de cadastro (ex: signup.html) que você precisa criar.');
    // window.location.href = 'signup.html'; // Descomente quando criar a página
});


// --- OBRIGATÓRIO: Observador de autenticação ---
// Isso é crucial para o login com GitHub (OAuth) e para redirecionar usuários já logados
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || (session && session.user)) {
        console.log('Usuário logado:', session.user.email);
        // Redireciona para a página de coleções
        window.location.href = 'https://alemedcolecoes.github.io/maisto-fresh-metal/';
    } else if (event === 'SIGNED_OUT') {
        console.log('Usuário deslogado.');
    }
});


// --- Função auxiliar para traduzir erros do Supabase ---
function getFriendlyErrorMessage(message) {
    if (message.includes('Invalid login credentials')) {
        return 'E-mail ou senha incorretos.';
    }
    if (message.includes('Email not confirmed')) {
        return 'E-mail não confirmado. Verifique sua caixa de entrada.';
    }
    if (message.includes('Email rate limit exceeded')) {
        return 'Muitas tentativas. Tente novamente mais tarde.';
    }
    return 'Ocorreu um erro. Tente novamente.';
}