
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

document.getElementById('btn-search').addEventListener('click',()=>{
    removeActive()
    const inputText=document.getElementById('input-text');
    const searchValue=inputText.value.trim().toLowerCase();
    console.log(searchValue);

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res=>res.json())
    .then(data=>{
        const allWords=data.data;
        console.log(allWords);
        
        const filterWords=allWords.filter((word)=>
            word.word.toLowerCase().includes(searchValue)
           
        )
        displayLevelWord(filterWords);
    })
})

const createElements=(arr)=>{
    const htmlElements=arr.map(el=>`<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}
const removeActive=()=>{
const removeactivelass=document.querySelectorAll('.lesson-btn');
removeactivelass.forEach(btn=>btn.classList.remove('active'))
}

const manageSpinners=(status)=>{
    
    if(status==true){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else{
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}

const loadWordDetail=async (id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    const res=await fetch(url);
    const detail=await res.json();
    displayWordDetails(detail.data);

}


const displayWordDetails=(word)=>{

    console.log(word);
const wordDisplayCard=document.getElementById('modal-box');
wordDisplayCard.innerHTML=`

    <div id="detail-container" class="space-y-4">
       <div  >
        <h2 class="text-2xl font-bold">${word.word ? word.word:'শব্দ পাওয়া যায়নি'} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation? word.pronunciation: 'Pronunciation শব্দ পাওয়া যায়নি'})</h2>
      </div>
      <div  >
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning? word.meaning: 'অর্থ পাওয়া যায়নি'}</p>
      </div>
      <div  >
        <h2 class="l font-bold">Example</h2>
        <p>${word.sentence? word.sentence: 'Sentence পাওয়া যায়নি'}</p>
      </div>
      <div  >
        <h2 class="font-bold">Synonym</h2>

        <div>
        ${createElements(word.synonyms)}
        </div>
        
      </div>
      </div>


`,
document.getElementById('my_modal_5').showModal();

}

const loadlevelWord=(id)=>{
    manageSpinners(true);
    const url=`https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
    removeActive()
    displayLevelWord(data.data)
    const activeBtn=document.getElementById(`lesson-btn-${id}`);
    activeBtn.classList.add('active');
    })
};

const displayLevelWord=(words)=>{
 const wordContainer=document.getElementById('word-container');
 wordContainer.innerHTML='';
if(words.length==0){
    wordContainer.innerHTML=`
     <div class=" font-bangla text-center  col-span-full py-10 rounded-xl space-y-6">
     <img class="mx-auto "src="./assets/alert-error.png" alt="">
    <p class="font-bold text-xl text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
    <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    manageSpinners(false)  
    return;
}
 words.forEach(word=>{
    console.log(word);
const wordCard=document.createElement('div');
wordCard.innerHTML=`
   <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
      <h2 class="font-bold text-2xl">${word.word ? word.word : 'শব্দ পাওয়া যায়নি'}</h2>
      <p class="font-semibold">Meaning /Pronounciation </p>
      <p class="font-medium text-2xl font-bangla">${word.meaning ? word.meaning: 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'Pronunciation শব্দ পাওয়া যায়নি'}</p>
       <div class="flex justify-between items-center">
      <button  onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
      <button onclick="pronounceWord('${word.word}')"class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
    </div>
    </div>`
wordContainer.append(wordCard)
 })
 manageSpinners(false)   
}



const loadLevel=()=>{
const url="https://openapi.programming-hero.com/api/levels/all";
fetch(url)
.then(response=>response.json())
.then(data=> displayLevel(data.data))
}

const displayLevel=(levels)=>{
const levelContainer=document.getElementById('level-container')
levelContainer.innerHTML='';

levels.forEach(level => {
    console.log(level.level_no)
    const levelButton=document.createElement('div');
    levelButton.innerHTML=`
      <button id="lesson-btn-${level.level_no}"onclick="loadlevelWord(${level.level_no})"class="btn btn-outline btn-primary lesson-btn">
  <i class="fa-solid fa-book-open"></i>
      Lesson-${level.level_no}
</button>
    `
  levelContainer.append(levelButton);  
});
    

}
loadLevel()