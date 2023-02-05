const ia_response = document.getElementById("IAresponse");
const user_request = document.getElementById("UserReq");
const submit_button = document.getElementById("SubmitButton");

user_request.addEventListener("keypress", (e) =>{
    if(user_request.value && e.key === "Enter"){
        sendQuestionToAI();
    }
});

submit_button.addEventListener("click", function(){
    sendQuestionToAI();
})

function sendQuestionToAI(){
    var sendQuestion = user_request.value;

    fetch(url_openAi, {
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: "Bearer " + api_key
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: sendQuestion,
            max_tokens: 2048,
            temperature: 0.5
        })
    })
    .then((response) => response.json())
    .then((json) => {
        if(ia_response.value) ia_response.value += "\n";

        if(json.error?.message){
            ia_response.value += `Error: ${json.error.message}`;
        }else if(json.choices?.[0].text){
            var text = json.choices[0].text || "Ainda não tenho uma resposta para esta pergunta :(";

            ia_response.value += "\nUFRA GPT: " + text;
        }

        ia_response.scrollTop = ia_response.scrollHeight;
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        user_request.value = "";
        user_request.disabled = false;
        user_request.focus();
    })

    if(ia_response.value) ia_response.value += "\n\n\n";

    ia_response.value += `Eu: ${sendQuestion}`;
    user_request.value = "Carregando...";
    user_request.disabled = true;

    ia_response.scrollTop = ia_response.scrollHeight;
}