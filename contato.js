// TROQUE pelos seus dados
  var WHATSAPP = "5511999999999";
  var EMAIL = "contato@seusite.com.br";
  var f = document.getElementById("f"), out = document.getElementById("msg");
  document.querySelectorAll("button[data-via]").forEach(function(b){
    b.addEventListener("click", function(){
      var d = new FormData(f);
      var nome=(d.get("nome")||"").trim(), tel=(d.get("tel")||"").trim(),
          email=(d.get("email")||"").trim(), msg=(d.get("msg")||"").trim();
      if(!nome || !tel || !/^\S+@\S+\.\S+$/.test(email) || !msg){
        out.className="err";
        out.textContent="Preencha nome, telefone, um e-mail válido e a mensagem.";
        return;
      }
      var assunto = d.get("assunto");
      var texto = "Olá! Meu nome é "+nome+".\nE-mail: "+email+"\nTelefone: "+tel+"\n\n"+msg;
      out.className="";
      if(b.dataset.via==="wa"){
        out.textContent="Abrindo o WhatsApp…";
        window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent("Assunto: "+assunto+"\n"+texto),"_blank","noopener");
      } else {
        out.textContent="Abrindo o seu aplicativo de e-mail…";
        location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent(assunto)+"&body="+encodeURIComponent(texto);
      }
    });
  });

// Ano automático no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Card dos criadores
var dlg = document.getElementById("criadores");
document.getElementById("abrir-criadores").addEventListener("click", function(){ dlg.showModal(); });
document.getElementById("fechar-criadores").addEventListener("click", function(){ dlg.close(); });
dlg.addEventListener("click", function(e){ if(e.target === dlg) dlg.close(); }); // clique fora fecha