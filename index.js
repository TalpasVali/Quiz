// State variables
let currentQuestionIndex = 0;
let score = 0;
let filteredQuestions = [];
let selectedChoices = [];
let isValidated = false;
let selectedCategory = "all";
let gameMode = "quiz"; // "quiz" or "invatare"

// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const categorySelect = document.getElementById("category-select");
const modeSelect = document.getElementById("mode-select");
const apiKeyInput = document.getElementById("api-key-input");

const resumeSessionContainer = document.getElementById("resume-session-container");
const resumeCategoryName = document.getElementById("resume-category-name");
const resumeProgressText = document.getElementById("resume-progress-text");
const resumeBtn = document.getElementById("resumeBtn");
const discardSessionBtn = document.getElementById("discardSessionBtn");

const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const clearLeaderboardBtn = document.getElementById("clearLeaderboardBtn");

const quizCategoryBadge = document.getElementById("quiz-category");
const quizQuestionNumber = document.getElementById("quiz-question-number");
const progressBarFill = document.getElementById("progress-bar-fill");

const questionText = document.getElementById("question-text");
const codeBlockContainer = document.getElementById("code-block-container");
const codeText = document.getElementById("code-text");
const copyCodeBtn = document.getElementById("copy-code-btn");
const choicesContainer = document.getElementById("choices-container");
const diagramContainer = document.getElementById("diagram-container");
const diagramImg = document.getElementById("diagram-img");

const explanationBox = document.getElementById("explanation-box");
const explanationTitle = document.getElementById("explanation-title");
const explanationTextContent = document.getElementById("explanation-text-content");
const referenceText = document.getElementById("reference-text");
const aiExplainBtn = document.getElementById("ai-explain-btn");
const aiExplanationLoading = document.getElementById("ai-explanation-loading");
const aiExplanationResult = document.getElementById("ai-explanation-result");

const finalScore = document.getElementById("final-score");
const percentageScore = document.getElementById("percentage-score");
const resultTitle = document.getElementById("result-title");
const resultUser = document.getElementById("result-user");
const leaderboardBody = document.getElementById("leaderboard-body");

// Fallback Quiz Data in case fetch fails (due to CORS policies in local file:/// execution)
const fallbackQuizData = [
  {
    "id": 1,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care dintre următoarele afirmații este/sunt adevărată/adevărate pentru algoritmul corespunzător funcției de mai jos (se consideră că x este un tablou unidimensional cu n elemente)",
    "cod_sursa": "def alg(x):\n    n=len(x)\n    nr=0\n    i=0\n    while(i<n):\n        k=0\n        while(((i+k)<n)and(x[i+k]>0)):\n            k=k+1\n        if (nr<k):\n            nr=k\n        i=i+k+1\n    return(nr)",
    "variante": {
      "a": "Algoritmul returnează numărul de elemente pozitive din x",
      "b": "Algoritmul returnează numărul de elemente din cea mai lungă subsecvență cu elemente pozitive din x",
      "c": "Algoritmul are ordinul de complexitate O(n2)",
      "d": "Algoritmul are ordinul de complexitate O(n)",
      "e": "Algoritmul are ordinul de complexitate O(n * k)"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "B este corectă deoarece k numără lungimea secvenței curente de numere pozitive (cât timp x[i+k]>0), iar nr reține lungimea maximă găsită. D este corectă deoarece, deși sunt două bucle while imbricate, variabila i avansează direct peste elementele verificate (i=i+k+1). Astfel, fiecare element din tablou este parcurs cel mult de două ori, rezultând o complexitate de timp liniară O(n).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 1",
    "imagine": ""
  },
  {
    "id": 2,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care dintre următoarele afirmații este/sunt adevărată/adevărate pentru algoritmul corespunzător funcției de mai jos (se consideră că a este un tablou unidimensional cu n elemente)",
    "cod_sursa": "def transform(a):\n    n=len(a)\n    for i in range(0,n-1):\n        if (a[i]<a[i+1]):\n            a[i], a[i+1] = a[i+1], a[i]\n    return(a)",
    "variante": {
      "a": "Algoritmul sortează descrescător tabloul a",
      "b": "După aplicarea algoritmului, tabloul a satisface proprietatea a[i] ≥ a[n−1] pentru 0 ≤ i < n",
      "c": "Algoritmul sortează crescător tabloul a",
      "d": "După aplicarea algoritmului, tabloul a satisface proprietatea a[i] ≤ a[n−1] pentru 0 ≤ i < n"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Algoritmul execută o singură trecere printr-un algoritm asemănător Bubble Sort. Nu sortează întregul tablou (deci A și C sunt false), ci doar compară perechi adiacente și face swap dacă elementul din stânga e mai mic decât cel din dreapta. Consecința dieser singure treceri este că cel mai mic element din întregul tablou va fi împins spre dreapta până ajunge pe ultima poziție (a[n-1]). Astfel, toate celelalte elemente a[i] vor fi mai mari sau egale cu a[n-1].",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 2",
    "imagine": ""
  },
  {
    "id": 3,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Se consideră două valori naturale a și b și algoritmul descris prin (// specifică operația de determinare a câtului împărțirii întregi):",
    "cod_sursa": "def alg(a,b):\n    if ((a==0)or(b==0)):\n        return(0)\n    elif (a%2 ==0):\n        return(alg(a//2, 2*b))\n    else:\n        return(alg(a//2, 2*b)+b)",
    "variante": {
      "a": "este posibil ca succesiunea de apeluri recursive să nu se termine",
      "b": "algoritmul returnează întotdeauna 0",
      "c": "algoritmul returnează produsul ab dacă a este par și ab+b dacă a este impar",
      "d": "algoritmul returnează produsul a*b indiferent de paritatea lui a",
      "e": "dacă a > 2b atunci numărul de operații de înmulțire efectuate este mai mic în cazul apelului alg(b,a) decât în cazul apelului alg(a,b)."
    },
    "raspuns_corect": [
      "d",
      "e"
    ],
    "explicatie": "Algoritmul implementează metoda 'Înmulțirii a la rousse' (sau înmulțirea țărănească) a două numere 'a' și 'b'. Variantele D și E sunt corecte. D: Funcționează bazat pe faptul că a*b = (a/2)*(2b) dacă a este par, și a*b = (a/2)*(2b) + b dacă a este impar. E: Numărul de apeluri recursive (și implicit de înmulțiri) depinde de numărul de înjumătățiri ale primului argument până devine 0 (log2(a)). Dacă a > 2b, atunci log2(b) < log2(a), deci apelul alg(b,a) va face mai puține împărțiri/înmulțiri.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 3",
    "imagine": ""
  },
  {
    "id": 4,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Se consideră un tablou unidimensional, a[0..n−1], cu n = 10^10 valori numerice și se pune problema determinării primelor 10 valori în ordine crescătoare. Care dintre următoarele abordări asigură faptul că a[0..9] conține cele mai mici 10 elemente în ordine crescătoare și este mai eficientă?",
    "cod_sursa": "",
    "variante": {
      "a": "se sortează a[0..n−1] crescător folosind algoritmul quicksort",
      "b": "se sortează parțial a aplicănd algoritmul de sortare prin inserție în care ciclul exterior for i in range(1,n) se înlocuiește cu for i in range(1,11)",
      "c": "se sortează parțial a aplicând algoritmul de sortare prin selecție în care ciclul exterior for i in range(0,n-1) se înlocuiește cu for i in range(0,10)"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Avem n imens (10 miliarde) și căutăm doar cele mai mici 10 elemente. Varianta A (quicksort pe tot tabloul) face muncă inutilă O(n log n). Varianta B (inserție adaptată) va sorta doar primele 11 elemente, dar le ignoră pe restul care ar putea fi mai mici. Varianta C este corectă: 'Selection sort' funcționează găsind elementul minim din restul nesortat al tabloului și punându-l pe poziția curentă. Rulând doar ciclul exterior de 10 ori (for i in range(0,10)), algoritmul va căuta cele mai mici 10 elemente din tot tabloul și le va plasa în a[0..9], executând aprox. 10*n operații.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 4",
    "imagine": ""
  },
  {
    "id": 5,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Se consideră algoritmul alg apelat pentru un număr natural n și se notează cu T(n) numărul de operații de adunare efectuate. Care dintre următoarele afirmații este(sunt) adevarată(e)?",
    "cod_sursa": "def alg(n):\n    if (n<2):\n        return(n)\n    else:\n        return(alg(n//2)+n%2)",
    "variante": {
      "a": "Algoritmul returnează câte cifre impare are numărul n",
      "b": "Algoritmul returnează numărul de cifre egale cu 1 din reprezentarea binară a lui n",
      "c": "T(n) = 1 dacă n < 2 și T(n) = T([n/2]) + n MOD 2 dacă n ≥ 2",
      "d": "T(n) = 0 dacă n < 2 și T(n) = T([n/2]) + 1 dacă n ≥ 2",
      "e": "T(n) aparține lui O(n)",
      "f": "T(n) aparține lui O(log n)"
    },
    "raspuns_corect": [
      "b",
      "d",
      "f"
    ],
    "explicatie": "Algoritmul determină numărul de biți '1' din reprezentarea binară a lui 'n' adunând valoarea lui n%2 la fiecare înjumătățire, deci B este corectă. Pentru analiza adunărilor T(n): baza este n<2 unde T(n)=0 (nicio adunare efectuată, doar se returnează n). Pentru n>=2, se execută o adunare ('+') între rezultatul recursiv și n%2, deci T(n) = T(n//2) + 1 (deci D este corectă, ignorând pe C). Din formula de recurență T(n) = T(n//2) + 1 rezultă o complexitate logaritmică a numărului de adunări, adică O(log n), deci F este corectă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 5",
    "imagine": ""
  },
  {
    "id": 6,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Algoritmul de sortare rapidă este cel mai potrivit pentru:",
    "cod_sursa": "",
    "variante": {
      "a": "sortarea unei liste mari cu elemente aleatoare",
      "b": "sortarea unei liste aproape ordonate",
      "c": "sortarea unei liste scurte",
      "d": "nu este potrivit pentru nici un fel de sortare"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "QuickSort (Sortarea rapidă) are o eficiență foarte bună pe caz mediu (liste mari cu elemente aleatoare), operând în O(n log n). Este ineficient pe liste gata ordonate (cazul defavorabil O(n^2)) dacă alegerea pivotului nu este optimizată, și există algoritmi mai simpli (ca Insertion Sort) preferabili pentru liste foarte scurte.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 6",
    "imagine": ""
  },
  {
    "id": 7,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Se consideră șirul lui Fibonacci dat de relația de recurență F0 = 0, F1 = 1 și Fn+1 = Fn + Fn−1. De câte ori este evaluat F2 pentru a calcula F5 în cazul calculului termenului Fn în mod recursiv.",
    "cod_sursa": "",
    "variante": {
      "a": "de 3 ori",
      "b": "o dată",
      "c": "de 4 ori",
      "d": "de 5 ori"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Dezvoltând recursivitatea pentru F5 obținem un arbore de apeluri: F5 = F4 + F3. F4 devine (F3 + F2), iar F3-ul original devine (F2 + F1). Deja avem de două ori F2. Din F4 derivă (F3 + F2) = (F2 + F1 + F2). În total, ramurile coboară la evaluarea lui F2 de exact 3 ori.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 7",
    "imagine": ""
  },
  {
    "id": 8,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care din următoarele afirmații NU sunt adevărate în cazul algoritmului de căutare binară:",
    "cod_sursa": "",
    "variante": {
      "a": "Trebuie folosit un tablou sortat",
      "b": "Trebuie să avem acces direct la elementul din mijloc",
      "c": "Algoritmul nu este eficient atunci când avem mai mult de 1000 de elemente",
      "d": "Algoritmul realizează sortarea elementelor unui tablou"
    },
    "raspuns_corect": [
      "c",
      "d"
    ],
    "explicatie": "Atenție la formularea 'NU sunt adevărate'. Căutarea binară *necesită* un tablou deja sortat (A e adevărată) și *necesită* acces direct la element (B e adevărată - motiv pentru care funcționează pe array-uri, nu pe liste simplu înlănțuite). C este falsă (algoritmul este EXTREM de eficient pentru date mari datorită complexității logaritmice O(log n)), iar D este de asemenea falsă (căutarea caută, nu sortează).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 8",
    "imagine": ""
  },
  {
    "id": 9,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Se consideră următorul algoritm aplicat unui număr n de forma n = ck ck−1 . . . c1 c0. Dacă p este o variabilă (implicită) care contorizează numărul de execuții ale ciclului (contorul ciclului), care este proprietatea invariantă?",
    "cod_sursa": "s = 0\nwhile n!=0:\n    d = n % 10\n    s = s+d\n    n = n//10",
    "variante": {
      "a": "s = c0 + c1 + . . .+ cp, n = ck ck−1 . . . cp",
      "b": "s = c0 + c1 + . . .+ cp−1, n = ck ck−1 . . . cp",
      "c": "s = c0 + c1 + . . .+ cp−1, n = ck ck−1 . . . c1 c0",
      "d": "n = ck ck−1 . . . cp"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Invariantul unei bucle este proprietatea care se menține adevărată la începutul fiecărei iterații. După 'p' iterații complete, algoritmul (care calculează suma cifrelor) a adunat ultimele 'p' cifre în variabila 's', adică s = c0 + c1 + ... + cp-1. Variabila 'n' a fost tăiată la dreapta de 'p' ori (prin n//10), rămânând cu cifrele n = ck ck-1 ... cp. Prin urmare, b este afirmația corectă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 9",
    "imagine": ""
  },
  {
    "id": 10,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Fie A = {a1, ..., an} un multiset. Pentru a găsi S = {s1, ..., sk}, un subset al lui A folosind tehnica căutarii local optimale (căutare lacomă – greedy):",
    "cod_sursa": "",
    "variante": {
      "a": "La fiecare pas elementul care pare a fi cel mai promițător la pasul respectiv este selectat din A și adăugat la S.",
      "b": "La fiecare pas elementul care pare a fi cel mai promițător la pasul respectiv este selectat din A și adăugat la S. Dacă ulterior nu este bun îl putem înlocui cu o altă componentă.",
      "c": "La fiecare pas elementul care pare a fi cel mai promițător pe ansamblul problemei este selectat din A și adăugat la S.",
      "d": "La fiecare pas un element oarecare este selectat din A și adăugat la S."
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Aceasta este definiția fundamentală a algoritmilor Greedy: ei fac alegerea local optimă la fiecare pas sperând că aceasta va duce la soluția global optimă (Varianta A). Nu se întorc asupra deciziilor luate (deci varianta B, specifică backtracking-ului, este falsă).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 10",
    "imagine": ""
  },
  {
    "id": 11,
    "materie": "Algoritmi și structuri de date",
    "enunt": "O listă liniară simplu înlănțuită este:",
    "cod_sursa": "",
    "variante": {
      "a": "lista liniară, în care relația de ordonare este materializată pe suport printr-un pointer către elementul următor;",
      "b": "o structură de date implementată prin tipul tablou;",
      "c": "o structură de date circulară;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Aceasta este definiția exactă a listei simplu înlănțuite: fiecare nod conține datele și un pointer explicit (o referință) către următorul nod în memorie. Varianta B este falsă (tablourile au alocare contiguă, nu bazată pe pointeri), iar C se referă la liste circulare, care sunt un caz particular.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 11",
    "imagine": ""
  },
  {
    "id": 12,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care din următoarele afirmații sunt corecte?",
    "cod_sursa": "",
    "variante": {
      "a": "Complexitatea (cea mai defavorabilă) pentru operațiile de inserare, ștergere sau căutare într-un arbore binar de căutare este O(log n).",
      "b": "Complexitatea (cea mai defavorabilă) pentru operațiile de inserare, ștergere sau căutare într-un arbore AVL este O(log n).",
      "c": "Complexitatea (cea mai defavorabilă) pentru operațiile de inserare, ștergere sau căutare într-un arbore splay tree este O(log n)."
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Arborii AVL sunt arbori binari de căutare strict echilibrați, garantând o înălțime logaritmică, deci complexitatea în cel mai rău caz ('worst-case') este $O(\\log n)$. Varianta A este falsă deoarece un BST neechilibrat poate degenera într-o listă, având $O(n)$. Varianta C este falsă deoarece arborii Splay garantează $O(\\log n)$ doar amortizaț pe o serie de operații, dar o singură operație în cel mai rău caz poate lua $O(n)$.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 12",
    "imagine": ""
  },
  {
    "id": 13,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care este complexitatea de inserare a unui element într-o listă înlănțuită sortată?",
    "cod_sursa": "",
    "variante": {
      "a": "O(1).",
      "b": "Θ(1).",
      "c": "O(n).",
      "d": "Θ(log n)."
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Deși operația efectivă de inserare a nodului (modificarea pointerilor) durează $O(1)$, pentru a menține lista sortată, trebuie mai întâi să traversezi lista secvențial pentru a găsi locul corect de inserare. În cel mai rău caz (elementul trebuie pus la final), asta presupune traversarea a 'n' elemente, rezultând o complexitate liniară de $O(n)$. Căutarea binară nu se poate aplica pe liste înlănțuite.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 13",
    "imagine": ""
  },
  {
    "id": 14,
    "materie": "Algoritmi și structuri de date",
    "enunt": "O stivă este:",
    "cod_sursa": "",
    "variante": {
      "a": "listă liniară în care inserările se fac la un capăt al listei și suprimările la celalalt capăt al listei;",
      "b": "o listă liniară de tipul LIFO (Last In First Out);",
      "c": "o listă liniară cu restricție la intrare;",
      "d": "o listă liniară în care se manipulează mereu elementul cel mai recent introdus."
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "Stiva (Stack) funcționează după principiul LIFO (Last In First Out - varianta B corectă). Toate operațiile (Push și Pop) se fac la un singur capăt (Top), ceea ce înseamnă că elementul extras este mereu ultimul introdus (varianta D corectă). Varianta A descrie o coadă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 14",
    "imagine": ""
  },
  {
    "id": 15,
    "materie": "Algoritmi și structuri de date",
    "enunt": "O structură de date de tip coadă este:",
    "cod_sursa": "",
    "variante": {
      "a": "structură de tip listă cu restricție la intrare;",
      "b": "o listă liniară de tipul FIFO (First In First Out);",
      "c": "o lista liniară în care toate operațiile se efectuează doar la unul din capetele listei;",
      "d": "o listă liniară în care inserările se efectuează la un capăt al listei, iar suprimările și ori ce alt acces se efectuează la celălalt capăt al listei."
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "Coada (Queue) funcționează pe principiul rândului la magazin: primul venit este primul serviț adică FIFO (First In First Out), deci B este corectă. Datele se adaugă la un capăt (Tail/Spate) și se extrag de la celălalt capăt (Head/Față), deci D este corectă. Varianta C descrie o stivă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 15",
    "imagine": ""
  },
  {
    "id": 16,
    "materie": "Algoritmi și structuri de date",
    "enunt": "În care din următoarele structuri de date, căutarea are complexitate (worst-case) O(log n)?",
    "cod_sursa": "",
    "variante": {
      "a": "liste înlănțuite;",
      "b": "heap;",
      "c": "liste skip;",
      "d": "arbori splay."
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Conform grilei de corectare a examenului, varianta corectă asumată este C (liste skip). O 'Skip List' este o structură de date probabilistă construită peste o listă înlănțuită sortată, adăugând ierarhii de legături care permit omiterea (skip) unor secțiuni mari. Comportamentul este proiectat pentru a oferi un timp de căutare $O(\\log n)$. (Notă: riguros matematic, the worst-case este $O(n)$, dar în paradigma de predare a acestei materii, performanța de $O(\\log n)$ este definitorie pentru Skip Lists spre deosebire de o listă simplă care are mereu $O(n)$).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 16",
    "imagine": ""
  },
  {
    "id": 17,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care din variantele de parcurgere a unui arbore binar de căutare poate fi folosită pentru afișarea tuturor nodurilor ordonate după cheia nodului.",
    "cod_sursa": "",
    "variante": {
      "a": "parcurgere breadth-first;",
      "b": "preordine;",
      "c": "inordine;",
      "d": "postordine."
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Într-un arbore binar de căutare (BST), nodurile din subarborele stâng au valori mai mici decât rădăcina, iar cele din subarborele drept au valori mai mari. Parcurgerea în 'Inordine' (In-order traversal) vizitează nodurile în secvența: Stânga - Rădăcină - Dreapta. Datorită proprietății BSȚ acest proces garantează vizitarea elementelor în ordine strict crescătoare.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 17",
    "imagine": ""
  },
  {
    "id": 18,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care este înălțimea minimă a unui arbore binar de căutare cu N noduri?",
    "cod_sursa": "",
    "variante": {
      "a": "O(1);",
      "b": "O(N);",
      "c": "O(N * log2(N));",
      "d": "O(log2(N))."
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "Înălțimea arborelui este numărul maxim de pași de la rădăcină la o frunză. Înălțimea maximă (worst-case) se atinge când arborele degenerează într-o listă: $O(N)$. Înălțimea MINIMĂ (best-case) se atinge când arborele este perfect echilibrat (fiecare nod intern are exact 2 copii). Într-un arbore binar perfecț numărul de noduri este aproximativ $2^h$, de unde rezultă că înălțimea minimă $h$ este exponențial logaritm în bază 2 din numărul de noduri, adică $O(\\log_2(N))$.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 18",
    "imagine": ""
  },
  {
    "id": 19,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Care din afirmațiile următoare sunt adevărate referitoare la operația de căutare într-un arbore binar de căutare cu N noduri:",
    "cod_sursa": "",
    "variante": {
      "a": "căutarea unui nod se face în O(log2(N)) dacă arborele este echilibrat.",
      "b": "căutarea unui nod se face întotdeauna în O(1) dacă nodul căutat nu există.",
      "c": "căutarea unui nod se face în (worst-case) O(N) dacă arborele nu este echilibrat.",
      "d": "căutarea unui nod se face în O(N * log2(N))."
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "Într-un BST de căutare (Binary Search Tree), timpul de căutare depinde direct de înălțimea arborelui. Dacă este echilibraț înălțimea e logaritmică, deci căutarea e proporțională cu $\\log_2(N)$ (varianta A corectă). Dacă e complet dezechilibrat (fiecare nod are un singur copil, arătând ca o listă înlănțuită liniară), înălțimea e N, deci căutarea unui nod din capăt necesită parcurgerea tuturor nodurilor, având o complexitate liniară de $O(N)$ (varianta C corectă).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 19",
    "imagine": ""
  },
  {
    "id": 20,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Fie următorul arbore binar de căutare, din care ștergem (prin copiere) nodul 40. Care dintre următoarele afirmații NU sunt adevărate: (A se studia Figura corespunzătoare problemei 20 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "La ștergerea nodului 40, acesta va putea fi înlocuit de nodul 35",
      "b": "La ștergerea nodului 40, acesta va putea fi înlocuit de nodul 37",
      "c": "La ștergerea nodului 40, acesta va putea fi înlocuit de nodul 38",
      "d": "La ștergerea nodului 40, acesta va putea fi înlocuit de nodul 44"
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "Atenție, enunțul cere afirmațiile FALS. Regula ștergerii unui nod cu 2 copii dintr-un BST spune că el trebuie înlocuit fie cu PREDECESORUL său în inordine (elementul maxim din subarborele stâng), fie cu SUCCESORUL său în inordine (elementul minim din subarborele drept). Pentru nodul 40, subarborele stâng are maximul 38. Subarborele drept are minimul 44. Deci, înlocuirile valide sunt 38 și 44. Rezultă că afirmațiile care spun că poate fi înlocuit cu 35 sau 37 sunt FALȘ adică variantele A și B.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 20",
    "imagine": "diagrame/diagrame_20.png"
  },
  {
    "id": 21,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Fie următorul arbore binar de cautare, din care stergem (prin copiere) nodul 20. Care dintre următoarele afirmaț ii sunt adevărate: (A se studia figura de la problema 21 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "La stergerea nodului 20, acesta va putea fi inlocuit cu nodul 12",
      "b": "La stergerea nodului 20, acesta va putea fi inlocuit cu nodul 11",
      "c": "La stergerea nodului 20, acesta va putea fi inlocuit cu nodul 23",
      "d": "La stergerea nodului 20, acesta va putea fi inlocuit cu nodul 22"
    },
    "raspuns_corect": [
      "a",
      "d"
    ],
    "explicatie": "Regula de aur la ștergerea unui nod cu doi descendenți dintr-un Arbore Binar de Căutare (BST) este să îl înlocuiești cu predecesorul său în inordine (valoarea maximă din subarborele stâng) sau cu succesorul său în inordine (valoarea minimă din subarborele drept). Conform figurii din culegere, pentru nodul 20, elementul maxim din subarborele stâng este 12, iar elementul minim din subarborele drept este 22. Deci, variantele A și D sunt corecte.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 21",
    "imagine": "diagrame/diagrame_21.png"
  },
  {
    "id": 22,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Fie urmatorul arbore binar. Parcurgerea in postordine corecta a acestui arbore este: (A se studia figura de la problema 22 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "5,2,1,9,6,8,4,3",
      "b": "1,9,2,4,3,8,6,5",
      "c": "5,2,1,9,4,6,8,3",
      "d": "1,9,2,5,3,8,6,4"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Parcurgerea în postordine (Post-order) urmează secvența: Subarbore Stâng -> Subarbore Drept -> Rădăcină. Aplicând recursiv acest tipar pe arborele prezentat în culegere, nodurile frunză sunt procesate primele de jos în suș iar rădăcina finală (5) este ultima. Se obține secvența 1, 9, 2, 4, 3, 8, 6, 5.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 22",
    "imagine": "diagrame/diagrame_22.png"
  },
  {
    "id": 23,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Fie urmatorul arbore binar. Parcurgerea in inordine a acestui arbore este: (A se studia figura de la problema 23 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "1,9,2,4,3,18,16,10",
      "b": "10,2,1,9,16,18,4,3",
      "c": "1,2,9,10,16,4,18,3",
      "d": "1,2,3,4,9,10,16,18"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Parcurgerea în inordine (In-order) vizitează nodurile astfel: Subarbore Stâng -> Rădăcină -> Subarbore Drept. Dacă aplicăm manual această regulă pe desenul din culegere, pornim de la stânga extremă și urcăm. Rădăcina principală (10) se va afla la mijlocul șirului. Secvența corectă este 1, 2, 9, 10, 16, 4, 18, 3.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 23",
    "imagine": "diagrame/diagrame_23.png"
  },
  {
    "id": 24,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Un min-heap binar este o structură de date care modelează un arbore binar aproape complet care are proprietatea de heap: Pentru orice nod N, dacă P este părintele lui N atunci cheia lui P este mai mică decât cheia lui N.\nImplementarea cu tablou a unui min-heap binar cu n noduri este un tablou A[0..2^m - 1] cu două atribute suplimentare: capacitatea A.length = 2^m - 1 și mărimea A.size = n, astfel încât A.size <= A.length. Elementele din nodurile min-heap-ului binar sunt reținute în primele n elemente ale lui A: rădăcina este reținută în A[0], iar dacă N este fiul stâng (resp. drept) al unui nod P reținut în A[i] atunci N este reținut în A[2*i + 1] (resp. A[2*i + 2]).\n\nPentru 0 <= i, j < n definim relația bunic(i, j) dacă A[j] reține părintele părintelui nodului din A[i]. Formula ce definește relația bunic(i, j) în un min-heap binar este:",
    "cod_sursa": "",
    "variante": {
      "a": "(4 * j + 3 <= i) și (i <= 4 * j + 6)",
      "b": "(4 * i + 3 <= j) și (j <= 4 * i + 6)",
      "c": "j = [i/4]",
      "d": "(4 * j + 1 <= i) și (i <= 4 * j + 2)",
      "e": "(4 * i + 1 <= j) și (j <= 4 * i + 2)"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Într-un array zero-indexed, fiii unui nod 'x' sunt '2x+1' și '2x+2'. Părintele unui nod 'i' este 'p = (i-1)//2'. Bunicul lui 'i' va fi 'j = (p-1)//2'. Rezolvând inegalitățile în sens invers pentru a afla intervalul în care se poate afla 'i' față de 'j' (care este echivalent cu a calcula fiii fiilor lui j), obținem: i aparține [4j+3, 4j+6]. Deci varianta A este corectă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 24",
    "imagine": ""
  },
  {
    "id": 25,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Un min-heap binar este o structură de date care modelează un arbore binar aproape complet care are proprietatea de heap: Pentru orice nod N, dacă P este părintele lui N atunci cheia lui P este mai mică decât cheia lui N.\nImplementarea cu tablou a unui min-heap binar cu n noduri este un tablou A[0..2^m - 1] cu două atribute suplimentare: capacitatea A.length = 2^m - 1 și mărimea A.size = n, astfel încât A.size <= A.length. Elementele din nodurile min-heap-ului binar sunt reținute în primele n elemente ale lui A: rădăcina este reținută în A[0], iar dacă N este fiul stâng (resp. drept) al unui nod P reținut în A[i] atunci N este reținut în A[2*i + 1] (resp. A[2*i + 2]).\n\nNumărul maxim de noduri în un min-heap binar cu adâncimea h este:",
    "cod_sursa": "",
    "variante": {
      "a": "2^(h+1) - 1",
      "b": "2^h",
      "c": "h^2 - 1",
      "d": "2^(h-1) + 1"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Numărul maxim de noduri într-un arbore binar (inclusiv un heap) de înălțime 'h' se obține atunci când arborele este perfect complet (fiecare nivel este plin). Nivelul 0 are 1 nod, nivelul 1 are 2, nivelul 2 are 4... nivelul h are 2^h. Suma unei progresii geometrice 2^0 + 2^1 + ... + 2^h este fix 2^(h+1) - 1.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 25",
    "imagine": ""
  },
  {
    "id": 26,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Un min-heap binar este o structură de date care modelează un arbore binar aproape complet care are proprietatea de heap: Pentru orice nod N, dacă P este părintele lui N atunci cheia lui P este mai mică decât cheia lui N.\nImplementarea cu tablou a unui min-heap binar cu n noduri este un tablou A[0..2^m - 1] cu două atribute suplimentare: capacitatea A.length = 2^m - 1 și mărimea A.size = n, astfel încât A.size <= A.length. Elementele din nodurile min-heap-ului binar sunt reținute în primele n elemente ale lui A: rădăcina este reținută în A[0], iar dacă N este fiul stâng (resp. drept) al unui nod P reținut în A[i] atunci N este reținut în A[2*i + 1] (resp. A[2*i + 2]).\n\n(1) Dacă A este un min-heap binar atunci A este sortat în ordinea crescătoare a cheilor din noduri? (2) Dacă A este sortat în ordinea crescătoare a cheilor din noduri atunci A este un min-heap binar?",
    "cod_sursa": "",
    "variante": {
      "a": "(1) fals (2) adevărat",
      "b": "(1) fals (2) fals",
      "c": "(1) adevărat (2) adevărat",
      "d": "(1) adevărat (2) fals"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Proprietatea de min-heap impune doar ca un părinte să fie mai mic sau egal cu descendenții săi (A[i] <= A[2i+1] și A[i] <= A[2i+2]), nu impune o ordine globală. De exemplu, array-ul [1, 5, 3] este un min-heap valid, dar nu este sortaț deci (1) este fals. În schimb, dacă un tablou este complet sortat crescător, proprietatea de părinte mai mic decât copiii este automat garantată, deci (2) este adevărat. Varianta A este corectă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 26",
    "imagine": ""
  },
  {
    "id": 27,
    "materie": "Algoritmi și structuri de date",
    "enunt": "Un min-heap binar este o structură de date care modelează un arbore binar aproape complet care are proprietatea de heap: Pentru orice nod N, dacă P este părintele lui N atunci cheia lui P este mai mică decât cheia lui N.\nImplementarea cu tablou a unui min-heap binar cu n noduri este un tablou A[0..2^m - 1] cu două atribute suplimentare: capacitatea A.length = 2^m - 1 și mărimea A.size = n, astfel încât A.size <= A.length. Elementele din nodurile min-heap-ului binar sunt reținute în primele n elemente ale lui A: rădăcina este reținută în A[0], iar dacă N este fiul stâng (resp. drept) al unui nod P reținut în A[i] atunci N este reținut în A[2*i + 1] (resp. A[2*i + 2]).\n\nTimpul de execuție a operației de ștergere a nodului cu cheie minimă din un min-heap binar cu n noduri este:",
    "cod_sursa": "",
    "variante": {
      "a": "O(1)",
      "b": "O(log n)",
      "c": "O(n log n)",
      "d": "O(n)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Ștergerea minimului (rădăcinii) într-un min-heap se face prin plasarea ultimului element din heap pe poziția rădăcinii, urmată de o 'cernere în jos' (Heapify-Down / Sift-Down) pentru a restabili proprietatea de heap. În cel mai rău caz, acest element va fi coborât până la baza arborelui. Cum heap-ul este un arbore aproape compleț înălțimea sa este logaritmică, rezultând un timp de execuție O(log n).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Algoritmi și structuri de date, Pb. 27",
    "imagine": ""
  },
  {
    "id": 28,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Se dau mulțimile A = {a, b, c}, B = {A, B, C, D} și C = {1, 2, 3, 4, 5}. Câte submulțimi ale mulțimii A ∪ B ∪ C conțin un element din A, două din B și cel puțin 4 elemente din C?",
    "cod_sursa": "",
    "variante": {
      "a": "15",
      "b": "14",
      "c": "100",
      "d": "108"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "Problema folosește Combinări. Pentru a alege 1 element din A (care are 3): C(3,1) = 3. Pentru a alege 2 elemente din B (care are 4): C(4,2) = 6. Pentru a alege 'cel puțin' 4 din C (care are 5) înseamnă fie 4, fie 5 elemente: C(5,4) + C(5,5) = 5 + 1 = 6. Numărul total de submulțimi se află prin înmulțire (regula produsului): 3 * 6 * 6 = 108. Deci D este corect.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 1",
    "imagine": ""
  },
  {
    "id": 29,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Câte numere întregi cuprinse între 1 și 1000 se divid cu 7, dar nu se divid cu 3?",
    "cod_sursa": "",
    "variante": {
      "a": "93",
      "b": "95",
      "c": "92",
      "d": "136"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Folosim Principiul includerii și excluderii. Numărul total de multipli de 7 până la 1000 este floor(1000 / 7) = 142. Dintre aceștia, trebuie să îi scădem pe cei care se divid și cu 3 (adică se divid cu 7 * 3 = 21). Numărul multiplilor de 21 este floor(1000 / 21) = 47. Răspunsul final este numărul multiplilor de 7 minus cei comuni cu 3: 142 - 47 = 95.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 2",
    "imagine": ""
  },
  {
    "id": 30,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "În câte feluri putem forma un buchet cu cinci trandafiri dacă putem folosi trandafiri roșii, galbeni și albi? Ordinea punerii trandafirilor în buchet nu este relevantă.",
    "cod_sursa": "",
    "variante": {
      "a": "21",
      "b": "120",
      "c": "125",
      "d": "243",
      "e": "15"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Deoarece ordinea nu contează și culorile se pot repeta, avem o problemă tipică de 'Combinări cu repetiție'. Formula este C(n + k - 1, k), unde 'n' este numărul de tipuri disponibile (3 culori) și 'k' este numărul de obiecte alese (5 trandafiri). Obținem C(3 + 5 - 1, 5) = C(7, 5). Știind că C(7, 5) = C(7, 2) = (7 * 6) / 2 = 21. Varianta A este corectă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 3",
    "imagine": ""
  },
  {
    "id": 31,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Un mesaj transmis pe un canal de comunicare este o secvență de 2 tipuri de semnale: semnale de tip A care durează 1 microsecundă, și semnale de tip B care durează 2 microsecunde. Fie an numărul de mesaje diferite care durează n microsecunde. Care este valoarea lui a10?",
    "cod_sursa": "",
    "variante": {
      "a": "89",
      "b": "55",
      "c": "2917",
      "d": "144"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Problema modelează Șirul lui Fibonacci. Un mesaj de 'n' secunde se poate obține fie adăugând un semnal A (1s) la un mesaj de n-1 secunde, fie adăugând un semnal B (2s) la un mesaj de n-2 secunde. Deci, recurența este a(n) = a(n-1) + a(n-2). Valorile inițiale sunt: a(1) = 1 (A) și a(2) = 2 (AA, B). Următorii termeni sunt: a(3)=3, a(4)=5, a(5)=8, a(6)=13, a(7)=21, a(8)=34, a(9)=55, a(10)=89.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 4",
    "imagine": ""
  },
  {
    "id": 32,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "În internet, format din rețele interconectate de calculatoare, fiecărei conexiuni de rețea dintr-un calculator i se atribuie o adresă internet. Protocolul IPv4 prevede că o adresă internet este un șir de 32 biți, format din un număr de rețea (netid) urmat de un număr de gazdă (hostid). Sunt 3 tipuri de adrese internet:\n(a) Clasa A: acestea sunt de forma 0b1b2b3b4...b7 (netid) | b8b9...b30b31 (hostid)\n(b) Clasa B: acestea sunt de forma 10b2b3b4...b15 (netid) | b16b17...b30b31 (hostid)\n(c) Clasa C: acestea sunt de forma 110b3b4b5...b23 (netid) | b24b25...b30b31 (hostid)\n\nCâte adrese IPv4 diferite sunt disponibile pentru conexiunile de rețea din internet?",
    "cod_sursa": "",
    "variante": {
      "a": "2^29 * 2^30 * 2^31",
      "b": "2^31",
      "c": "7 * 2^29",
      "d": "2^32"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Calculăm adresele din fiecare clasă pe baza biților liberi rămași din totalul de 32. Clasa A începe cu '0' (1 bit blocat) -> rămân 31 de biți liberi (2^31 adrese). Clasa B începe cu '10' (2 biți blocați) -> rămân 30 de biți (2^30). Clasa C începe cu '110' (3 biți blocați) -> rămân 29 de biți (2^29). Total adrese = 2^31 + 2^30 + 2^29. Aducând toutul la puterea cea mai mică (2^29), obținem: (2^2 * 2^29) + (2^1 * 2^29) + (1 * 2^29) = (4 + 2 + 1) * 2^29 = 7 * 2^29.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 5",
    "imagine": ""
  },
  {
    "id": 33,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Fie rețeaua de transport G cu sursa s și destinația t. Care este valoarea fluxului maxim în G? (Referință la diagrama problemei 6 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "8",
      "b": "5",
      "c": "6",
      "d": "7"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "Pentru a determina fluxul maxim într-o rețea de transport de la o sursă 's' la o destinație 't', se folosește algoritmul Ford-Fulkerson sau tăietura minimă (Min-Cut). Aplicând mental algoritmul pe graful problemei 6, saturând succesiv drumurile cele mai scurte/lungi și identificând gâtuirile de pe muchiile grafului, capacitatea maximă a fluxului care ajunge în nodul destinație 't' este calculată ca fiind 7.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 6",
    "imagine": "diagrame/diagrame_33.png"
  },
  {
    "id": 34,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Fie graful ponderat. Ce greutate totală are arborele minim de acoperire al acestui graf? (Referință la diagrama problemei 7 din culegere)",
    "cod_sursa": "",
    "variante": {
      "a": "229",
      "b": "216",
      "c": "230",
      "d": "234"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Un arbore minim de acoperire (Minimum Spanning Tree) trebuie să conecteze toate nodurile grafului folosind numărul minim de muchii și costul total cel mai mic, fără a forma cicluri. Folosind un algoritm greedy precum Kruskal (luând mereu muchia cu costul cel mai mic rămasă disponibilă) sau Prim, și însumând ponderile muchiilor alese pe baza figurii din culegere, greutatea totală minimă care conectează toate nodurile este 229.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 7",
    "imagine": "diagrame/diagrame_34.png"
  },
  {
    "id": 35,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Care din grafurile următoare este eulerian? (Referință la diagramele grafurilor G1, G2, G3, G4 din problema 8)",
    "cod_sursa": "",
    "variante": {
      "a": "G1, G4",
      "b": "G2, G3",
      "c": "nici unul",
      "d": "G4",
      "e": "G1, G3"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Pentru ca un graf neorientat și conex să fie Eulerian (adică să conțină un circuit care traversează fiecare muchie exact o dată), trebuie să îndeplinească o singură condiție absolută: gradul FIECĂRUI nod din graf trebuie să fie PAR. Dacă inspectăm vizual nodurile din figurile problemei 8, doar grafurile G2 și G3 conțin exclusiv noduri la care sunt conectate un număr par de muchii.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 8",
    "imagine": "diagrame/diagrame_35.png"
  },
  {
    "id": 36,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Care din grafurile următoare are un cuplaj perfect? (Referință la diagramele G1, G2, G3, G4 din problema 9)",
    "cod_sursa": "",
    "variante": {
      "a": "G1",
      "b": "G2",
      "c": "G3",
      "d": "G4"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Un 'cuplaj perfect' într-un graf este o submulțime de muchii disjuncte (care nu împart niciun nod comun) ce reușesc să atingă absolut toate nodurile grafului exact o singură dată. Dacă un graf are un număr impar de noduri, este imposibil să aibă un cuplaj perfect. Analizând figurile, graful G1 permite formarea perechilor complete între toate nodurile sale, îndeplinind așadar condiția.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 9",
    "imagine": "diagrame/diagrame_36.png"
  },
  {
    "id": 37,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Câți arbori diferiți cu 5 noduri, numerotate de la 1 la 5, există?",
    "cod_sursa": "",
    "variante": {
      "a": "10",
      "b": "273",
      "c": "32",
      "d": "120",
      "e": "125"
    },
    "raspuns_corect": [
      "e"
    ],
    "explicatie": "Pentru a calcula câți arbori distincti se pot forma folosind un set de 'n' noduri etichetate (numerotate), se folosește 'Teorema (sau Formula) lui Cayley'. Formula este n^(n-2). În cazul nostru, n = 5, așadar numărul de arbori diferiți este 5^(5-2) = 5^3 = 5 * 5 * 5 = 125.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 10",
    "imagine": ""
  },
  {
    "id": 38,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Câte cuplaje maxime are graful bipartit complet K_{m,n} dacă 1 ≤ m ≤ n? Observați că un astfel de cuplaj trebuie să aibă m muchii.",
    "cod_sursa": "",
    "variante": {
      "a": "m",
      "b": "m + n",
      "c": "P(n, m)",
      "d": "C(n, m)",
      "e": "m^n",
      "f": "n^m"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Un cuplaj maxim într-un graf bipartit complet K_{m,n} (unde partițiile au dimensiunile m și n, cu m ≤ n) trebuie să acopere toate cele m noduri din partiția mai mică. Pentru primul din cele m noduri putem alege pereche oricare din cele n noduri din a doua partiție. Pentru al doilea nod alegem din cele n-1 rămase, și așa mai departe. Acesta este exact numărul de Aranjamente de n luate câte m, adică permutări parțiale, care se notează cu P(n,m) sau A_n^m.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 11",
    "imagine": ""
  },
  {
    "id": 39,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Câte muchii are graful complet K_n?",
    "cod_sursa": "",
    "variante": {
      "a": "C(n, 2)",
      "b": "n^2",
      "c": "2n",
      "d": "n * (n − 1)",
      "e": "n"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Un graf complet K_n are o muchie între oricare două perechi de noduri distincte. Deoarece numărul total de perechi neordonate posibile dintr-o mulțime de n noduri este Combinări de n luate câte 2, graful are exact C(n, 2) muchii. (Formula extinsă pentru C(n,2) este n(n-1)/2).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 12",
    "imagine": ""
  },
  {
    "id": 40,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Se presupune că n ≥ 3. Câte regiuni are o reprezentare planară a grafului bipartit complet K_{n,2}?",
    "cod_sursa": "",
    "variante": {
      "a": "n + 1",
      "b": "n",
      "c": "2 * n",
      "d": "C(n, 2)",
      "e": "P(n, 2)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Folosim Formula lui Euler pentru grafuri planare conexe: V - E + R = 2. Graful bipartit complet K_{n,2} are partițiile de dimensiuni n și 2. Numărul total de noduri este V = n + 2. Numărul de muchii este produsul dimensiunilor, adică E = n * 2 = 2n. Înlocuind în formulă obținem: (n + 2) - 2n + R = 2, adică -n + 2 + R = 2, ceea ce rezultă în R = n regiuni.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 13",
    "imagine": ""
  },
  {
    "id": 41,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Un șir ternar este un șir care conține doar cifrele 0,1 și 2. Fie a_n numărul șirurilor ternare de lungime n care nu conțin apariții consecutive ale cifrei 0. De exemplu, a_1 = 3 și a_2 = 8. Care din formulele următoare are loc pentru orice n ≥ 3:",
    "cod_sursa": "",
    "variante": {
      "a": "a_n = 2 * a_{n−1} + 2 * a_{n−2}",
      "b": "a_n = 2 * a_{n−1} + 2 * a_{n−2} + 3^{n−1}",
      "c": "a_n = 2 * a_{n−1} + 3 * a_{n−2}",
      "d": "a_n = 2 * a_{n−1} + 3^{n−1}"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Construim un șir valid de lungime n. Dacă el se termină în cifra 1 sau 2 (deci 2 variante posibile), restul șirului de lungime n-1 poate fi orice șir valid (a_{n-1}). Aici avem 2 * a_{n-1} posibilități. Dacă se termină în cifra 0, obligatoriu cifra de pe poziția n-1 trebuie să fie 1 sau 2 (ca să nu avem zerouri consecutive, deci 2 variante). Restul șirului de lungime n-2 poate fi orice șir valid (a_{n-2}). Obținem alte 2 * a_{n-2} posibilități. Adunând cele două scenarii, obținem a_n = 2*a_{n-1} + 2*a_{n-2}.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 14",
    "imagine": ""
  },
  {
    "id": 42,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Care dintre grafurile următoare au numărul cromatic 2:",
    "cod_sursa": "",
    "variante": {
      "a": "Orice arbore cu n ≥ 2 noduri.",
      "b": "Orice graf complet K_n cu număr par de noduri.",
      "c": "Orice graf complet K_n cu număr impar de noduri mai mare sau egal cu 3.",
      "d": "Orice graf ciclic C_n cu n ≥ 2 număr par.",
      "e": "Orice graf ciclic C_n cu n ≥ 2 număr impar.",
      "f": "Orice graf bipartit K_{m,n}."
    },
    "raspuns_corect": [
      "a",
      "d",
      "f"
    ],
    "explicatie": "Un graf are număr cromatic 2 (poate fi colorat cu fix 2 culori astfel încât 2 noduri adiacente să nu aibă aceeași culoare) dacă și numai dacă este un graf bipartit. Arborii (a) nu au cicluri, deci sunt mereu bipartiți. Ciclurile pare (d) se pot colora alternant cu 2 culori. Orice graf bipartit (f) se împarte prin definiție în 2 mulțimi independente, deci folosește 2 culori. Grafurile complete K_n au număr cromatic n, iar ciclurile impare au 3, deci celelalte variante sunt false.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 15",
    "imagine": ""
  },
  {
    "id": 43,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Fie M_n mulțimea matricilor de dimensiune n x n cu elemente 0 sau 1. Pentru orice două matrici A, B ∈ M_n și 1 <= k <= n definim operațiile A ⊕ B și A ⊙_k B în felul următor: A ⊕ B = C ∈ M_n dacă C[i][j] = max(A[i][j], B[i][j]) și A ⊙_k B = D ∈ M_n dacă D[i][j] = A[i][k] * B[k][j] pentru toți 1 <= i, j <= n.\nFie G un graf simplu neorientat cu n noduri numerotate de la 1 la n, și A_G ∈ M_n matricea lui de adiacență.\n\nNumărul de grafuri neorientate simple cu n noduri numerotate de la 1 la n este:",
    "cod_sursa": "",
    "variante": {
      "a": "2^{n(n−1)/2}",
      "b": "2^n",
      "c": "n(n− 1)/2",
      "d": "n− 1",
      "e": "n * (n− 1)"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Un graf neorientat simplu cu n noduri poate avea maxim C(n, 2) = n(n-1)/2 muchii posibile. Pentru un graf oarecare, fiecare muchie dintre cele posibile are fix două stări independente: fie există, fie nu există. Aplicând regula produsului, numărul total de grafuri distincte este 2 ridicat la puterea numărului maxim de muchii, adică 2^{n(n-1)/2}.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 16",
    "imagine": ""
  },
  {
    "id": 44,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Fie M_n mulțimea matricilor de dimensiune n x n cu elemente 0 sau 1. Pentru orice două matrici A, B ∈ M_n și 1 <= k <= n definim operațiile A ⊕ B și A ⊙_k B în felul următor: A ⊕ B = C ∈ M_n dacă C[i][j] = max(A[i][j], B[i][j]) și A ⊙_k B = D ∈ M_n dacă D[i][j] = A[i][k] * B[k][j] pentru toți 1 <= i, j <= n.\nFie G un graf simplu neorientat cu n noduri numerotate de la 1 la n, și A_G ∈ M_n matricea lui de adiacență.\nFie I_n matricea identitate de dimensiune n x n, și 1 <= p <= n. Se consideră algoritmul următor de calcul al matricii B ∈ M_n.\n\nComplexitatea temporală a calculului matricii B este:",
    "cod_sursa": "B = A_G ⊕ I_n;\nfor k := 1 to p do\n  C = B ⊕ (B ⊙_k B);\n  B = C;",
    "variante": {
      "a": "Θ(p * n^2)",
      "b": "Θ(p * n)",
      "c": "Θ(p * n^3)",
      "d": "Θ(n), Θ(p * 2^n)"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Algoritmul dat este nucleul algoritmului lui Roy-Warshall pentru închiderea tranzitivă (drumuri). În interiorul buclei 'for' (care se execută de 'p' ori), se calculează operația B ⊙_k B. Pentru un 'k' fixaț D[i][j] depinde doar de A[i][k] și B[k][j], calcul care trebuie făcut pentru toate cele n rânduri și n coloane. Aceasta înseamnă n * n = n^2 operații la fiecare pas. Rulându-se de p ori, complexitatea totală este Θ(p * n^2).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 17",
    "imagine": ""
  },
  {
    "id": 45,
    "materie": "Teoria grafurilor și combinatorică",
    "enunt": "Fie M_n mulțimea matricilor de dimensiune n x n cu elemente 0 sau 1. Pentru orice două matrici A, B ∈ M_n și 1 <= k <= n definim operațiile A ⊕ B și A ⊙_k B în felul următor: A ⊕ B = C ∈ M_n dacă C[i][j] = max(A[i][j], B[i][j]) și A ⊙_k B = D ∈ M_n dacă D[i][j] = A[i][k] * B[k][j] pentru toți 1 <= i, j <= n.\nFie G un graf simplu neorientat cu n noduri numerotate de la 1 la n, și A_G ∈ M_n matricea lui de adiacență.\nFie I_n matricea identitate de dimensiune n x n, și 1 <= p <= n. Se consideră algoritmul următor de calcul al matricii B ∈ M_n.\n\nCare din afirmațiile următoare este adevărată când B[i][j] = 1?",
    "cod_sursa": "B = A_G ⊕ I_n;\nfor k := 1 to p do\n  C = B ⊕ (B ⊙_k B);\n  B = C;",
    "variante": {
      "a": "Există o cale de lungime cel mult p + 1 de la nodul i la nodul j.",
      "b": "Există o cale de lungime p de la nodul i la nodul j.",
      "c": "Există o cale de la nodul i la nodul j care trece prin nodul p.",
      "d": "Există o cale de la nodul i la nodul j care trece prin toate nodurile din mulțimea {1, 2, . . . , p}."
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Rularea algoritmului Roy-Warshall până la iterația 'p' garantează că la final B[i][j]=1 dacă și numai dacă există un drum de la nodul i la nodul j care folosește CA INTERMEDIARI doar noduri din mulțimea restrânsă {1, 2, ..., p}. Orice drum simplu care are nodurile intermediare dintr-o mulțime de dimensiune maximă 'p' poate conține maxim p noduri intermediare. Dacă avem p noduri intermediare, drumul are fix p+1 muchii (sari de la i, treci prin p noduri, ajungi la j). Deci, lungimea căii (în muchii) este obligatoriu de cel mult p+1.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Teoria grafurilor, Pb. 18",
    "imagine": ""
  },
  {
    "id": 46,
    "materie": "Logică computațională",
    "enunt": "Considerați, în logica predicatelor, limbajul care conține următoarele simboluri:\n• variabile, pentru care se folosesc litere mici;\n• simboluri funcționale F: + (binar, infix), − (unar, prefix), ∗ (binar, infix);\n• simboluri predicative P: =, <, ≤ (toate binare, infix);\n• simboluri pentru constante C: 0, 1.\n\nCare din următoarele sunt termeni peste acest limbaj?",
    "cod_sursa": "",
    "variante": {
      "a": "(0 ∗ x)− 1",
      "b": "1 + (z ∗ x) < 0",
      "c": "x+ ((−1) ∗ 0)",
      "d": "0 ∗ (y + 1)"
    },
    "raspuns_corect": [
      "c",
      "d"
    ],
    "explicatie": "Un termen este format doar din constante, variabile și funcții aplicate pe alți termeni. Predicatele (precum <) formează formule, nu termeni, deci (b) este incorect. Funcția minus (-) este definită ca fiind 'unar, prefix', deci se aplică în fața unui singur termen. În (a), minusul e folosit ca operator infix (între doi termeni), deci sintaxa e greșită. În (c), minusul este prefix pentru 1, deci (-1) e un termen corecț iar în (d) se folosesc corect doar funcțiile binare + și *. Așadar, variantele C și D sunt corecte.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 1",
    "imagine": ""
  },
  {
    "id": 47,
    "materie": "Logică computațională",
    "enunt": "Pentru următoarele formule propoziționale, și pentru interpretarea {P, ¬Q}:",
    "cod_sursa": "",
    "variante": {
      "a": "((P ⇒ Q) ∧ ((¬Q) ∧ P)) are valoarea sub interpretare A (Adevărat)",
      "b": "((P ⇒ Q) ⇒ (Q ⇒ P)) are valoarea sub interpretare A (Adevărat)",
      "c": "((¬(P ∨ Q)) ∧ (¬Q)) are valoarea sub interpretare F (Fals)"
    },
    "raspuns_corect": [
      "b",
      "c"
    ],
    "explicatie": "Interpretarea {P, ¬Q} înseamnă că P este Adevărat (T), iar Q este Fals (F). În varianta (a), implicația (P ⇒ Q) devine (T ⇒ F) care este Fals. Deci toată conjuncția devine Falsă, nu Adevărată. În varianta (b), (P ⇒ Q) este Falș iar (Fals ⇒ orice) este Adevăraț deci (b) evaluează la Adevărat. În (c), (P ∨ Q) este Adevăraț negația este Falș deci conjuncția devine Falsă, ceea ce se potrivește cu afirmația variantei. Pentru urmare, (b) și (c) sunt afirmații corecte.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 2",
    "imagine": ""
  },
  {
    "id": 48,
    "materie": "Logică computațională",
    "enunt": "Care din următoarele afirmații este adevărată:",
    "cod_sursa": "",
    "variante": {
      "a": "dacă o formulă propozițională este validă, atunci este satisfiabilă",
      "b": "dacă o formulă propozițională nu este validă, atunci este nesatisfiabilă",
      "c": "dacă o formulă propozițională nu este validă, atunci negația sa este satisfiabilă",
      "d": "dacă o formulă propozițională nu este validă, atunci negația sa este validă"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "O formulă este 'validă' dacă e adevărată pentru orice interpretare (tautologie). Este 'satisfiabilă' dacă e adevărată pentru CEL PUȚIN o interpretare. (a) este corectă: ce e valabil mereu, este valabil și de cel puțin o dată. Dacă o formulă 'nu este validă', înseamnă că are cel puțin o interpretare pentru care e Falsă. (b) este greșită pentru că o formulă poate fi adevărată uneori și falsă alteori (contingentă, deci satisfiabilă dar nevalidă). (c) este corectă: dacă e falsă măcar o dată, negația ei va fi adevărată măcar o dată (deci satisfiabilă). (d) este greșită, deoarece negația e validă doar dacă formula inițială e mereu falsă (nesatisfiabilă).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 3",
    "imagine": ""
  },
  {
    "id": 49,
    "materie": "Logică computațională",
    "enunt": "Care este relația dintre propozițiile (F ∧ G) ⇒ H și F ⇒ (G ⇒ H)?",
    "cod_sursa": "",
    "variante": {
      "a": "sunt logic echivalente",
      "b": "prima este o consecință logică a celei de-a doua",
      "c": "a doua este o consecință logică a primeia",
      "d": "nu se relaționează în niciunul din modurile descrise."
    },
    "raspuns_corect": [
      "a",
      "b",
      "c"
    ],
    "explicatie": "Dacă aplicăm echivalențele logice pentru implicație (X ⇒ Y ≡ ¬X ∨ Y): Prima formulă devine ¬(F ∧ G) ∨ H, care prin De Morgan este ¬F ∨ ¬G ∨ H. A doua formulă devine ¬F ∨ (¬G ∨ H), adică ¬F ∨ ¬G ∨ H. Deoarece au aceeași formă redusă, sunt logic echivalente (a). Fiind echivalente, fiecare o implică pe cealaltă, deci prima este consecință pentru a doua (b) și a doua consecință pentru prima (c).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 4",
    "imagine": ""
  },
  {
    "id": 50,
    "materie": "Logică computațională",
    "enunt": "Formula P ⇔ Q este:\n\nAceste formule fiind:\n• Q ⇒ R\n• R ⇒ (P ∧ Q)\n• P ⇒ (Q ∨ R)",
    "cod_sursa": "",
    "variante": {
      "a": "logic echivalentă cu conjuncția formulelor de mai jos",
      "b": "o consecință logică a formulelor de mai jos",
      "c": "logic echivalentă cu disjuncția formulelor de mai jos"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "O formulă este 'consecință logică' a unui set de premise dacă ori de câte ori premisele sunt toate Adevărate, formula este Adevărată. Presupunând P ≠ Q, se demonstrează că nu putem avea toate cele 3 premise Adevărate simultan (ex. P=A, Q=F face P ⇒ (Q ∨ R) Fals dacă R e F, iar dacă R e A, R ⇒ (P ∧ Q) devine Fals). Deci premisele sunt adevărate doar când P = Q. Asta înseamnă că premisele IMPLICĂ P ⇔ Q, fiind o consecință logică (b). Nu e o echivalență, deoarece există cazuri în care P ⇔ Q e Adevăraț dar premisele nu sunt (de ex: P=F, Q=F, R=A).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 5",
    "imagine": ""
  },
  {
    "id": 51,
    "materie": "Logică computațională",
    "enunt": "Care din formulele de mai jos sunt în formă normală disjunctivă?",
    "cod_sursa": "",
    "variante": {
      "a": "P",
      "b": "¬P ∨ Q",
      "c": "P ∧ ¬Q ∧ S",
      "d": "(P ∧ ¬Q ∧ S) ∨ ¬S"
    },
    "raspuns_corect": [
      "a",
      "b",
      "c",
      "d"
    ],
    "explicatie": "Forma Normală Disjunctivă (FND) înseamnă că o formulă este alcătuită dintr-o disjuncție (SAU) de conjuncții (ȘI) de literali (variabile sau negațiile lor). O variabilă singură 'P' este o FND formată dintr-o singură clauză cu un literal (a). '¬P ∨ Q' este disjuncția a două conjuncții de câte un literal (b). 'P ∧ ¬Q ∧ S' este o FND formată dintr-o singură conjuncție de 3 literali (c). '(P ∧ ¬Q ∧ S) ∨ ¬S' e disjuncția perfectă a două conjuncții (d). Toate sunt în FND.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 6",
    "imagine": ""
  },
  {
    "id": 52,
    "materie": "Logică computațională",
    "enunt": "Care din următoarele este un rezolvent al clauzelor {P, ¬Q, R} și {¬P, Q, S}?",
    "cod_sursa": "",
    "variante": {
      "a": "∅",
      "b": "{P, ¬P, R, S}",
      "c": "{R, S}"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Regula de rezoluție spune că poți elimina EXACT O pereche de literali complementari din două clauze, unind restul elementelor. Între {P, ¬Q, R} și {¬P, Q, S} avem două perechi complementare: P cu ¬P și Q cu ¬Q. Nu putem elimina ambele perechi deodată! Dacă eliminăm perechea Q cu ¬Q, rămânem cu reuniunea restului: {P, R} ∪ {¬P, S} = {P, ¬P, R, S}. Deci varianta (b) este un rezolvent corect (chiar dacă este o tautologie). Eliminarea ambelor ar da {R,S}, dar aceasta este o aplicare incorectă a regulii.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 7",
    "imagine": ""
  },
  {
    "id": 53,
    "materie": "Logică computațională",
    "enunt": "Pentru a verifica faptul că o formulă G este o consecință logică a formulelor F1, . . . , Fn, se poate:",
    "cod_sursa": "",
    "variante": {
      "a": "verifica dacă (F1 ∧ . . . ∧ Fn) ⇒ G este nesatisfiabilă",
      "b": "verifica dacă ¬F1 ∨ . . . ∨ ¬Fn ∨ G este nesatisfiabilă",
      "c": "verifica dacă ¬F1 ∨ . . . ∨ ¬Fn ∨ G este validă",
      "d": "verifica dacă F1 ∧ . . . ∧ Fn ∧ ¬G este nesatisfiabilă."
    },
    "raspuns_corect": [
      "c",
      "d"
    ],
    "explicatie": "Afirmația 'G este consecință logică din F1..Fn' este echivalentă cu 'formula (F1 ∧ ... ∧ Fn) ⇒ G este mereu adevărată (VALIDĂ)'. Transcriind implicația, obținem ¬(F1 ∧ ... ∧ Fn) ∨ G, care devine ¬F1 ∨ ... ∨ ¬Fn ∨ G (aceasta trebuie verificată dacă este validă, deci (c) este corectă). Alternativ, prin metoda reducerii la absurd, demonstrăm că 'Premisele ȘI (negația Concluziei) nu se pot întâmpla simultan', deci F1 ∧ ... ∧ Fn ∧ ¬G trebuie să fie nesatisfiabilă (d corectă).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 8",
    "imagine": ""
  },
  {
    "id": 54,
    "materie": "Logică computațională",
    "enunt": "Există o formulă logic echivalenta cu (...) ⇒ ¬(P3 ⇒ P6), care conține doar conectori propoziționali din mulțimea:",
    "cod_sursa": "",
    "variante": {
      "a": "{¬, ∨}",
      "b": "{∨, ∧}",
      "c": "{|}",
      "d": "{⊥, →}"
    },
    "raspuns_corect": [
      "a",
      "c",
      "d"
    ],
    "explicatie": "Problema testează noțiunea de 'sistem funcțional complet' (mulțime adecvată de conectori), adică setul cu care poți scrie ORICE formulă logică posibilă. Setul {¬, ∨} este baza formei normale, deci e complet (a). Operatorul NȘI (NAND), notat cu {|}, este universal și suficient de unul singur pentru a exprima orice (c). Setul Fals și Implicație {⊥, →} este de asemenea complet deoarece negația e P→⊥, iar disjuncția se deduce tot de aici (d). În schimb, {∨, ∧} (b) este incomplet deoarece nu poate exprima niciodată negația.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 9",
    "imagine": "diagrame/diagrame_54.png"
  },
  {
    "id": 55,
    "materie": "Logică computațională",
    "enunt": "Mulțimea de clauze ce corespunde formulei (¬P ⇒ (Q ∧ R)) ⇒ (P ⇒ ¬Q) este:",
    "cod_sursa": "",
    "variante": {
      "a": "{{¬P, ¬Q}}",
      "b": "{{P, ¬Q}, {P, R}, {¬Q, R}}",
      "c": "{{P, ¬Q, ¬R}, {P, Q, R}, {¬P, ¬Q, R}}"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Dacă reducem formula matematic pentru a o aduce la forma normală conjunctivă (mulțime de clauze): Membrul stâng e P ∨ (Q ∧ R), iar dreptul e ¬P ∨ ¬Q. Implicația totală devine ¬( P ∨ (Q ∧ R) ) ∨ ¬P ∨ ¬Q. Aplicând De Morgan, avem (¬P ∧ (¬Q ∨ ¬R)) ∨ ¬P ∨ ¬Q. Cum ¬P apare disjunctiv lângă grupul (¬P ∧ ...), grupul cu ȘI este 'absorbit' complet și dispare, rămânând pur și simplu ¬P ∨ ¬Q. Astfel, obținem o singură clauză: {¬P, ¬Q}, corespunzătoare opțiunii A.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 10",
    "imagine": ""
  },
  {
    "id": 56,
    "materie": "Logică computațională",
    "enunt": "Considerați mulțimea de clauze: (1) {P,Q,¬R}, (2) {¬P,R}, (3) {P,¬Q,S}, (4) {¬P,¬Q,¬R}, (5) {P,¬S}. Formula corespunzătoare acestei mulțimi este:",
    "cod_sursa": "",
    "variante": {
      "a": "validă",
      "b": "satisfiabilă",
      "c": "nesatisfiabilă"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "O formulă în formă clauzală este satisfiabilă dacă există cel puțin o atribuire de valori (T/F) pentru care TOATE clauzele sunt adevărate simultan. Dacă încercăm P=Adevăraț atunci clauza (2) ne forțează ca R=Adevărat (pentru că ¬P e Fals). Dacă P=Adevărat și R=Adevăraț clauza (4) devine {Falș ¬Q, Fals}, deci ne forțează ca ¬Q să fie Adevăraț adică Q=Fals. Verificăm restul: (1) {Ț F, F} = T. (3) {Ț Ț S} = T. (5) {Ț ¬S} = T. S poate fi orice. Pentru că am găsit un model care funcționează (P=Ț R=Ț Q=F), mulțimea este satisfiabilă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 11",
    "imagine": ""
  },
  {
    "id": 57,
    "materie": "Logică computațională",
    "enunt": "Metoda Davis-Putnam returnează răspunsul satisfiabil:",
    "cod_sursa": "",
    "variante": {
      "a": "când se generează clauza vidă",
      "b": "când se generează mulțimea vidă de clauze",
      "c": "când nu se pot genera clauze noi, și clauza vidă nu este în mulțimea de clauze"
    },
    "raspuns_corect": [
      "b",
      "c"
    ],
    "explicatie": "Metoda Davis-Putnam (DP) încearcă să demonstreze nesatisfiabilitatea reducând mulțimea de clauze la clauza vidă (care reprezintă o contradicție). Dacă reușește să elimine toate clauzele (rămânând mulțimea vidă de clauze), înseamnă că totul e adevărat și formula e satisfiabilă (b). De asemenea, dacă algoritmul se blochează și nu mai poate deduce nimic nou, dar încă nu a generat clauza vidă (contradicția), înseamnă că sistemul este consistent și, din nou, satisfiabil (c). Dacă ar fi generat clauza vidă (a), ar fi fost nesatisfiabilă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 12",
    "imagine": ""
  },
  {
    "id": 58,
    "materie": "Logică computațională",
    "enunt": "Pentru a demonstra o formulă G când se cunoaște o disjuncție A ∨ B:",
    "cod_sursa": "",
    "variante": {
      "a": "se presupune A și se demonstrează G, apoi se presupune B și se demonstrază G",
      "b": "se presupune A și se demonstrează G",
      "c": "se presupune ¬A și se demonstrează B și G"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Aceasta este regula eliminării disjuncției (sau raționamentul prin cazuri). Deoarece știm sigur că măcar unul dintre evenimentele A sau B este adevăraț pentru a demonstra că G decurge din ele, trebuie să demonstrăm G pe ambele ramuri posibile: analizăm cazul în care A este adevărat și deducem G, apoi analizăm separat cazul în care B este adevărat și deducem G.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 13",
    "imagine": ""
  },
  {
    "id": 59,
    "materie": "Logică computațională",
    "enunt": "Fie P,Q,R variabile propoziționale. Care din formulele propoziționale de mai jos corespund funcției booleene cu trei argumente care returnează A dacă argumentele sale reprezintă codificarea binară a unui număr prim?",
    "cod_sursa": "",
    "variante": {
      "a": "P ∧ Q ∧ ¬R",
      "b": "(¬P ∧ Q) ∨ (P ∧ R)",
      "c": "(¬P ∧ Q ∧ ¬R) ∨ (((¬P ∧ Q) ∨ P) ∧ R)",
      "d": "((¬P ∧ Q) ∨ (P ∧ ¬Q) ∨ (P ∧ Q))"
    },
    "raspuns_corect": [
      "b",
      "c"
    ],
    "explicatie": "Codificările binare pentru 3 biți (0-7) corespunzătoare numerelor prime (2, 3, 5, 7) sunt: 010, 011, 101, 111. Formula trebuie să dea Adevărat DOAR pentru aceste cazuri. Dacă testăm varianta (b): (¬P ∧ Q) este Adevărat pentru 010 (2) și 011 (3). (P ∧ R) este Adevărat pentru 101 (5) și 111 (7). Cele două acoperă exact numerele prime. Varianta (c) este doar o scriere expandată și logic echivalentă a variantei (b), acoperind aceleași stări.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 14",
    "imagine": ""
  },
  {
    "id": 60,
    "materie": "Logică computațională",
    "enunt": "Fie mulțimea de clauze: {{¬P,¬Q,R}, {P,¬Q,¬R}, {¬P,R}, {P,¬Q,R}, {¬Q,¬R}} . Primul pas în aplicarea metodei Davis Putnam asupra mulțimii de clauze consistă în:",
    "cod_sursa": "",
    "variante": {
      "a": "aplicarea regulii de împărțire (folosind literalul ¬P)",
      "b": "aplicarea regulii literalului pur (unde literalul pur este ¬Q)",
      "c": "aplicarea unui pas de rezoluție",
      "d": "aplicarea regulii clauzei cu un singur literal (folosind ultima clauză)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "În metoda Davis-Putnam, se caută mai întâi simplificări evidente. Un 'literal pur' este un literal care apare într-o mulțime de clauze doar cu o singură polaritate (fie doar afirmaț fie doar negat). Observăm că 'Q' nu apare deloc ca afirmat (pozitiv) în nicio clauză, ci apare doar sub forma '¬Q' în clauzele 1, 2, 4 și 5. Deci ¬Q este un literal pur, iar DP va simplifica sistemul atribuindu-i valoarea Adevărat. Ultima clauză nu are un singur literal (are doi), deci (d) e falsă.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Logică computațională, Pb. 15",
    "imagine": ""
  },
  {
    "id": 61,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Limbajul generat de gramatica G = (VN, VT, S, P), unde VN = {S}; VT = {a, b}; P = {S → aSb|aAb, A → aA|λ}, este:",
    "cod_sursa": "",
    "variante": {
      "a": "L = {a^m b^n | m ≥ n ≥ 1}",
      "b": "L = {a^n a^m b^n | n ≥ 0, m ≥ 0}",
      "c": "L = {a^(i+1) b^i | i ≥ 1}",
      "d": "L = {a^(n+i) b^n | n ≥ 1, i ≥ 0}"
    },
    "raspuns_corect": [
      "a",
      "d"
    ],
    "explicatie": "Regula S → aSb generează a^k S b^k. La un moment daț folosim S → aAb, ceea ce adaugă încă un 'a' și un 'b', dând a^(k+1) A b^(k+1). Regula A → aA generează un număr arbitrar 'i' de litere 'a', iar apoi dispare prin A → λ. Șirul final va avea forma a^(k+1+i) b^(k+1). Notând n = k+1 (unde n ≥ 1), obținem a^(n+i) b^n, cu n ≥ 1, i ≥ 0 (deci D este corectă). Aceasta înseamnă că mereu vom avea cel puțin la fel de mulți 'a' câți 'b', dar numărul de 'b' este de cel puțin 1. Asta e identic cu a afirma că șirul are forma a^m b^n unde m ≥ n ≥ 1 (varianta A corectă).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 1",
    "imagine": ""
  },
  {
    "id": 62,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Regulile gramaticii G = (VN, VT, S, P), unde VN = {S}, VT = {PCR, PDAR, UDMR}, P = {S → PCR | PDAR | UDMR}, respectă restricțiile impuse gramaticilor:",
    "cod_sursa": "",
    "variante": {
      "a": "regulate (tip 3)",
      "b": "independente de context (tip 2)",
      "c": "dependente de context (tip 1)",
      "d": "de tipul 0, 1, 2, 3"
    },
    "raspuns_corect": [
      "a",
      "b",
      "c",
      "d"
    ],
    "explicatie": "Regulile sunt de forma Neterminal → Terminal (ex: S → PCR, unde PCR este tratat ca un singur simbol terminal din dicționar). Aceasta corespunde exact regulilor pentru o gramatică regulată (Tipul 3 din ierarhia Chomsky). Întrucât ierarhia Chomsky este inclusivă, orice gramatică de Tip 3 este automat și de Tip 2, Tip 1 și Tip 0.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 2",
    "imagine": ""
  },
  {
    "id": 63,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Regulile gramaticii G = (VN, VT, S, P), unde P = {S → abc | aAbc, Ab → bA, Ac → Bbcc, bB → Bb, aB → aaA | aa}, respectă restricțiile impuse gramaticilor:",
    "cod_sursa": "",
    "variante": {
      "a": "regulate (tip 3)",
      "b": "independente de context (tip 2)",
      "c": "dependente de context (tip 1)",
      "d": "de tipul 0"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "Reguli precum Ab → bA și bB → Bb au mai multe simboluri (inclusiv terminale) în stânga producției, ceea ce exclude imediat gramaticile de Tip 3 (regulate) și Tip 2 (independente de context). Deși producțiile sunt monotone (nu scurtează șirul), ele nu respectă forma strictă de substituție a gramaticilor dependente de context (Tip 1), care cere înlocuirea unui singur neterminal într-un context specific (αAβ → αyβ). Rămâne exclusiv încadrarea în categoria generală, nerestricționată, de Tipul 0.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 3",
    "imagine": ""
  },
  {
    "id": 64,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Expresia regulată ce notează limbajul L = {w | șiruri de 0 și 1 ce conțin cel putin un simbol 1}, este:",
    "cod_sursa": "",
    "variante": {
      "a": "(0|1)∗1",
      "b": "1 | (0|1)∗1(1|0)∗",
      "c": "0∗11∗",
      "d": "(0|1)∗1(0|1)∗"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "Un șir care conține cel puțin un '1' poate avea orice fel de combinații de 0 și 1 înainte de '1', și orice fel de combinații de 0 și 1 după '1'. Varianta D descrie exact asta: (0|1)* înseamnă orice combinație, apoi urmează obligatoriu un 1, urmat iar de orice combinație (0|1)*. Varianta B o include și pe D în ramura dreaptă a disjuncției, fiind de asemenea complet corectă funcțional.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 4",
    "imagine": ""
  },
  {
    "id": 65,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Limbajul L notat de expresia regulata 01∗|1; este:",
    "cod_sursa": "",
    "variante": {
      "a": "L = {0, 1, 00, 01, 10, 11, 000, ...}",
      "b": "L = {w ∈ {0, 1}∗ | w începe cu 1}",
      "c": "L = {w ∈ {0, 1}∗ | w începe cu 0}",
      "d": "L = {01^n | n ≥ 0} ∪ {1}"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "Expresia regulată are două ramuri delimitate de operatorul SAU (|). Prima ramură este '01*', care înseamnă un '0' urmat de oricâte cifre de '1' (adică 01^n, cu n ≥ 0). A doua ramură este pur și simplu cifra '1'. Limbajul rezultat este reuniunea acestor două seturi posibile, ceea ce este exprimat perfect de varianta (d).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 5",
    "imagine": ""
  },
  {
    "id": 66,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Limbajul L notat de expresia regulata (1|0)∗0(0|1) este:",
    "cod_sursa": "",
    "variante": {
      "a": "L = {0, 1, 00, 01, 10, 11, ...}",
      "b": "L = {w ∈ {0, 1}∗ | w se termină cu 00 sau 01}",
      "c": "L = {w ∈ {0, 1}∗ | w are cel putin un simbol 0}",
      "d": "L = {w ∈ {0, 1}∗ | w are 0 în penultima poziție}"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "Analizăm finalul expresiei regulate: ea se termină cu '0(0|1)'. Asta înseamnă că ultimele două caractere ale oricărui șir generat trebuie să fie '00' sau '01'. Prin urmare, penultimul caracter este obligatoriu '0' (varianta D). Impliciț șirul se termină strict cu grupurile 00 sau 01 (varianta B).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 6",
    "imagine": ""
  },
  {
    "id": 67,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Dacă L1 este un limbaj regulat iar despre L2 nu se cunoaște tipul dar L1 \\ L2 este regulaț atunci L2 poate să fie:",
    "cod_sursa": "",
    "variante": {
      "a": "mulțimea vidă",
      "b": "independent de context",
      "c": "decidabil",
      "d": "regulat"
    },
    "raspuns_corect": [
      "a",
      "b",
      "d"
    ],
    "explicatie": "Dacă diferența de limbaje L1 \\ L2 este un limbaj regulaț limbajul L2 poate aparține teoretic oricărei clase din ierarhie (dacă elementele care diferă se elimină în mod convenabil sau pur și simplu nu se suprapun). Dacă L2 este mulțimea vidă (a), L1 \\ ∅ = L1, care știam că e regulat. Poate fi regulat (d). Poate fi independent de context (b) (de ex: un L2 care nu are nicio intersecție cu L1, rezultând din nou tot L1).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 7",
    "imagine": ""
  },
  {
    "id": 68,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Aplicând Lema de pompare pentru un limbaj regulaț considerăm un cuvânt w suficient de lung care aparține limbajului L și îl descompunem în ...... părți.",
    "cod_sursa": "",
    "variante": {
      "a": "2",
      "b": "5",
      "c": "3",
      "d": "6"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "Lema de pompare (Pumping Lemma) pentru limbaje regulate afirmă că orice cuvânt 'w' dintr-un limbaj regulat (care este mai lung decât o constantă 'p') poate fi partiționat în exact 3 părți: w = xyz, cu anumite proprietăți (y nu e vid, iar x(y^n)z aparține limbajului pentru orice n).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 8",
    "imagine": ""
  },
  {
    "id": 69,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "O producție de forma A → B, unde A și B nu sunt terminale, se numește:",
    "cod_sursa": "",
    "variante": {
      "a": "Regulă de ștergere",
      "b": "Redenumire",
      "c": "Formă normală Greibach",
      "d": "Formă normală Chomsky"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "O producție unitară (în care un neterminal produce exact un alt neterminal singur) se numește 'regulă de redenumire' (sau producție unitară). În timpul algoritmilor de simplificare a gramaticilor, aceste reguli sunt eliminate prin expandare, tocmai pentru că ele funcționează doar ca un alias.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 9",
    "imagine": ""
  },
  {
    "id": 70,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Care dintre producțiile de mai jos poate fi acceptată de gramatica în formă normală Chomsky, unde A, B, C și S sunt neterminale iar a este terminal?",
    "cod_sursa": "",
    "variante": {
      "a": "A → BC",
      "b": "A → a",
      "c": "S → λ",
      "d": "nici una din cele menționate anterior"
    },
    "raspuns_corect": [
      "a",
      "b",
      "c"
    ],
    "explicatie": "Prin definiție, o gramatică este în Forma Normală Chomsky (FNC) dacă TOATE regulile ei au una dintre cele două forme de bază: un neterminal produce alte două neterminale (A → BC, varianta a), sau un neterminal produce exact un terminal (A → a, varianta b). Adițional, regula S → λ (varianta c) este tolerată și acceptată dacă limbajul respectiv conține cuvântul vid.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 10",
    "imagine": ""
  },
  {
    "id": 71,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Care dintre următoarele seturi de reguli corespund unei gramatici în formă normală Chomsky?",
    "cod_sursa": "",
    "variante": {
      "a": "A → AB|BC|CD, A → 0, B → 1, C → 2, D → 3",
      "b": "A → AB, S → BCA|0|1|2|3",
      "c": "S → ABa, A → aab, B → Ac",
      "d": "toate cele menționate anterior"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Forma Normală Chomsky impune ca orice regulă să se mapaze pe Tipul [Neterminal → Neterminal Neterminal] sau [Neterminal → terminal_simplu]. Varianta (a) respectă 100% regula (ex: A → AB, A → 0). Variantele B și C sunt incorecte deoarece conțin reguli care produc un amestec de peste 2 neterminale sau neterminale combinate cu terminale pe aceeași ramură (ex: S → BCA, S → ABa).",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 11",
    "imagine": ""
  },
  {
    "id": 72,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Fie L limbajul generat de gramatica G = (V_N, V_T, S, P), unde V_N = {S, A, B, C, X, Y, Z}, V_T = {a, b, c}, iar regulile de producție P sunt:\n\nAlegeți răspunsurile corecte.",
    "cod_sursa": "S → λ | AX | BY | CZ\nX → λ | BY | CZ\nY → λ | AX | CZ\nZ → λ | AX | BY\nA → a\nB → b\nC → c",
    "variante": {
      "a": "L este limbaj regulat",
      "b": "L nu este limbaj regulat",
      "c": "L este limbaj de programare"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Analizând gramatica, observăm că A, B și C funcționează ca simple alias-uri pentru 'a', 'b' și 'c'. Dacă le înlocuim mental (ex: S → aX), observăm că la fiecare paș se produce fix un terminal urmat de fix un neterminal. Aceasta este forma strictă a unei gramatici 'regulat-liniare la dreapta', ceea ce implică în mod direct că L este un limbaj regulat.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 12",
    "imagine": ""
  },
  {
    "id": 73,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Fie L limbajul generat de gramatica G = (V_N, V_T, S, P), unde V_N = {S, A, B, C, X, Y, Z}, V_T = {a, b, c}, iar regulile de producție P sunt:\n\nCare din afirmațiile următoare este adevărată?",
    "cod_sursa": "S → λ | AX | BY | CZ\nX → λ | BY | CZ\nY → λ | AX | CZ\nZ → λ | AX | BY\nA → a\nB → b\nC → c",
    "variante": {
      "a": "L = {w ∈ VT∗ | w nu conține litere consecutive identice}",
      "b": "L = {w ∈ VT∗ | w conține litere consecutive identice}",
      "c": "L = {w ∈ VT∗ | w conține subșirul abc}",
      "d": "L = {λ}"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "Urmărind fluxul regulilor gramaticale: dacă starea curentă emite un 'a' (prin AX care apelează A→a), se duce în starea X. Odată ajuns în starea X, regulile permise sunt doar BY sau CZ (adică va emite un 'b' sau un 'c', dar niciodată un 'a'). Prin urmare, sistemul nu poate produce niciodată două litere identice una după alta.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 13",
    "imagine": ""
  },
  {
    "id": 74,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Fie L limbajul generat de gramatica G = (V_N, V_T, S, P), unde V_N = {S, A, B, C, X, Y, Z}, V_T = {a, b, c}, iar regulile de producție P sunt:\n\nFie s_n numărul șirurilor din L cu lungimea n. Pentru orice n > 1 are loc relația de recurență:",
    "cod_sursa": "S → λ | AX | BY | CZ\nX → λ | BY | CZ\nY → λ | AX | CZ\nZ → λ | AX | BY\nA → a\nB → b\nC → c",
    "variante": {
      "a": "sn = 2 · sn−1",
      "b": "sn = 3 · sn−1",
      "c": "sn = sn−1 + 2 · sn−2",
      "d": "sn = 3 sn−1 + sn−2"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "La pasul 1, avem 3 opțiuni posibile pentru prima literă a șirului (a, b sau c). După ce a fost aleasă prima literă, pentru a doua poziție ne mai rămân doar 2 opțiuni valabile (pentru a nu avea litere consecutive identice, cum am demonstrat la grila anterioară). Pentru a treia literă avem iar 2 opțiuni (diferite de a doua) și tot așa. Acest lucru înseamnă că pentru a trece de la șirurile de lungime n-1 la cele de lungime n, înmulțim mereu stările cu 2.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 14",
    "imagine": ""
  },
  {
    "id": 75,
    "materie": "Limbaje formale și teoria automatelor",
    "enunt": "Fie L limbajul generat de gramatica G = (V_N, V_T, S, P), unde V_N = {S, A, B, C, X, Y, Z}, V_T = {a, b, c}, iar regulile de producție P sunt:\n\nCâte șiruri cu lungimea 4 conține L?",
    "cod_sursa": "S → λ | AX | BY | CZ\nX → λ | BY | CZ\nY → λ | AX | CZ\nZ → λ | AX | BY\nA → a\nB → b\nC → c",
    "variante": {
      "a": "16",
      "b": "24",
      "c": "32",
      "d": "81",
      "e": "243"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "Pe baza deducției de la grila anterioară, putem calcula matematic. Pentru prima literă: 3 opțiuni. Pentru a doua literă: 2 opțiuni (deoarece excludem litera aleasă înainte). Pentru a treia literă: 2 opțiuni. Pentru a patra literă: 2 opțiuni. Conform regulii produsului (Principiul combinatoricii), numărul total de șiruri distincte de lungime 4 este: 3 * 2 * 2 * 2 = 24 de șiruri.",
    "referinta_sursa": "Tematica 1: Structuri discrete și algoritmi - Limbaje formale, Pb. 15",
    "imagine": ""
  },
  {
    "id": 76,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Ce afișează următoarea secvență de cod?",
    "cod_sursa": "y = 9\ndef test(x = 42, y = 3):\n    x = x + y\n    y += 1\n    print(x, y)\ntest()",
    "variante": {
      "a": "45 4",
      "b": "51 10",
      "c": "Eroare la execuție deoarece variabilaynu este definită",
      "d": "Eroare la compilare deoarece funcția este apelată fară argumente",
      "e": "None"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 1",
    "imagine": ""
  },
  {
    "id": 77,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Considerând secvența de cod, care dintre secvențele de cod de mai jos returnează șirul de caractere 'aom'?",
    "cod_sursa": "s = 'Timisoara'",
    "variante": {
      "a": "s[::-3]",
      "b": "s[::2]",
      "c": "s[-1:3:1]",
      "d": "[i for i in s if i in ’aom’]",
      "e": "”.join([i for i in s if i in ’aom’])"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 2",
    "imagine": ""
  },
  {
    "id": 78,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Care este valoarea expresiei:\n1 + 2 ** 3 * 4",
    "cod_sursa": "",
    "variante": {
      "a": "33",
      "b": "4097",
      "c": "36",
      "d": "108",
      "e": "42"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 3",
    "imagine": ""
  },
  {
    "id": 79,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Este sigur să folosim operatorul==pentru a verifica dacă două variabile de tipfloatsunt egale ?",
    "cod_sursa": "",
    "variante": {
      "a": "Nu deoarece reprezentarea internă a valorilor de tipfloatnu este precisă",
      "b": "Da, bineînțeles",
      "c": "Nu, operatorul pentru comparație este!=",
      "d": "Da, deoarece reprezentarea în virgulă mobilă asigură precizia necesară",
      "e": "Da, Python asigură aproximările necesare comparării valorilor de tipfloat"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 4",
    "imagine": ""
  },
  {
    "id": 80,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Care dintre opțiunile de mai jos reprezintă o inițializare corectă a unui dicționar:",
    "cod_sursa": "",
    "variante": {
      "a": "d = (’nume’: ’valoare’)",
      "b": "d = ’nume’: ’valoare’",
      "c": "d = {’nume’:’valoare’}",
      "d": "d = [’nume’=’valoare’]"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 5",
    "imagine": ""
  },
  {
    "id": 81,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Care este rezultatul execuției următoarei secvențe de cod?",
    "cod_sursa": "nume1 = ['Maria', 'Ioana', 'Cristian', 'Mirel']\nnume2 = nume1\nnume3 = nume1[:]\nnume2[0] = 'Vasile'\nnume3[1] = 'Andrada'\nsum = 0\nfor ls in (nume1, nume2, nume3):\n    if ls[0] == 'Vasile':\n        sum += 1\n    if ls[1] == 'Andrada':\n        sum += 10\nprint(sum)",
    "variante": {
      "a": "11",
      "b": "12",
      "c": "21",
      "d": "22",
      "e": "33",
      "f": "0"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 6",
    "imagine": ""
  },
  {
    "id": 82,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Fie următoarea secvență de cod. Cum putem apela metoda salut() din clasa Persoana?",
    "cod_sursa": "class Persoana(object):\n    def __init__(self, nume):\n        self.nume = nume\n    def salut(self):\n        print (\"Salut\")\n\nclass Profesor(Persoana):\n    def __init__(self, nume, titlu):\n        Persoana.__init__(self, nume)\n        self.titlu = titlu\n    def salut(self):\n        print (\"Buna ziua\")\n\nprof1 = Profesor(\"Decebal Popescu\", \"Asistent\")",
    "variante": {
      "a": "Persoana.salut(prof1)",
      "b": "prof1.salut()",
      "c": "super(prof1).salut()",
      "d": "Persoana(prof1).salut()",
      "e": "Nu putem apela metoda salut() din clasa Persoana deoarece este supraîncărcată în clasa Profesor"
    },
    "raspuns_corect": [
      "a",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 7",
    "imagine": ""
  },
  {
    "id": 83,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Care este rezultatul execuției următoarei secvențe de cod?",
    "cod_sursa": "class A:\n    def __init__(self):\n        self.calcI(30)\n    def calcI(self, i):\n        self.i = 2 * i\n\nclass B(A):\n    def __init__(self):\n        super().__init__()\n        print(\"i from B is\", self.i)\n    def calcI(self, i):\n        self.i = 3 * i\n\nb = B()",
    "variante": {
      "a": "Doar metoda__init__din clasaBeste invocată",
      "b": "Metoda__init__din clasaAeste invocată s ,i se afișează“i from B is 0”.",
      "c": "Metoda__init__din clasaAeste invocată s ,i se afișează“i from B is 60”.",
      "d": "Metoda__init__din clasaAeste invocată s ,i se afișează“i from B is 90”."
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 8",
    "imagine": ""
  },
  {
    "id": 84,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Când este executată clauza finally dintr-un bloc try-except?",
    "cod_sursa": "",
    "variante": {
      "a": "doar când nu are loc nici o excepție",
      "b": "doar când are loc o excepție",
      "c": "tot timpul",
      "d": "doar dacă o anumită condiție specificată este îndeplinită",
      "e": "niciodată"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 9",
    "imagine": ""
  },
  {
    "id": 85,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Python",
    "enunt": "Care dintre variantele de mai jos deschide un fișier pentru scriere?",
    "cod_sursa": "",
    "variante": {
      "a": "output_file = open(\"hello.txt\", \"r\")",
      "b": "output_file = open(\"hello.txt\", \"w\")",
      "c": "output_file = openFile(\"hello.txt\", \"w\")",
      "d": "output_file = File(\"hello.txt\", \"w\")",
      "e": "output_file = open(\"hello.txt\", encoding=\"utf8\")"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Python, Pb. 10",
    "imagine": ""
  },
  {
    "id": 86,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Fie următoarea secvență de cod:\n\nÎn urma apelului swap(x, y), valorile variabilelor x, respectiv y vor fi:",
    "cod_sursa": "#define swap(a,b) {int aux; aux=a; a=b; b=aux;}\nfloat x=10.5, y=3.75;",
    "variante": {
      "a": "x=3.75, y=10.5;",
      "b": "x=3.0, y=10.5;",
      "c": "x=3.75, y=10.0;",
      "d": "x=3.0, y=10.0;"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 1",
    "imagine": ""
  },
  {
    "id": 87,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce reprezintă domeniul de vizibilitate a unei variabile?",
    "cod_sursa": "",
    "variante": {
      "a": "plaja de valori pe care le poate lua;",
      "b": "locul unde se creează;",
      "c": "locul din textul sursă unde poate fi folosită;",
      "d": "dacă are semn sau nu;"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 2",
    "imagine": ""
  },
  {
    "id": 88,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "La execuția programului următor se tastează 20. Ce se va afișa după execuție?",
    "cod_sursa": "#include<stdio.h>\nvoid main() {\nchar a;\nscanf(\"%c\",&a);\nprintf(\"%c\",a); }",
    "variante": {
      "a": "20;",
      "b": "2;",
      "c": "0;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 3",
    "imagine": ""
  },
  {
    "id": 89,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Care este rezultatul numeric al evaluării expresiei:\na<b<c\ndacă a=-2, b=-1 si c=0?",
    "cod_sursa": "",
    "variante": {
      "a": "1;",
      "b": "TRUE;",
      "c": "0;",
      "d": "FALSE;"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 4",
    "imagine": ""
  },
  {
    "id": 90,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce se va afișa în urma execuției secvenței următoare:",
    "cod_sursa": "#include<stdio.h>\nvoid main() {\nunsigned char x=25;\nx=x<<2;\nprintf(\"%d\",(int)x); }",
    "variante": {
      "a": "27;",
      "b": "100;",
      "c": "23;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 5",
    "imagine": ""
  },
  {
    "id": 91,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce afișează programul?",
    "cod_sursa": "#include<stdio.h>\nvoid main() {\nint x,y,z;\nx=y=z=4;\nprintf(\"%d\",(x<<z)-(x|y)+(z&y));}",
    "variante": {
      "a": "64",
      "b": "4",
      "c": "0",
      "d": "5",
      "e": "33",
      "f": "32"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 6",
    "imagine": ""
  },
  {
    "id": 92,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Care din următoarele variante reprezintă modalități de comunicare între funcții?",
    "cod_sursa": "",
    "variante": {
      "a": "apel;",
      "b": "prin variabile locale;",
      "c": "prin argumentele actuale;",
      "d": "prin valoarea returnată;",
      "e": "prin variabile globale",
      "f": "prin includere"
    },
    "raspuns_corect": [
      "c",
      "d",
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 7",
    "imagine": ""
  },
  {
    "id": 93,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce este contextul de apel al unei funcții?",
    "cod_sursa": "",
    "variante": {
      "a": "lista argumentelor formale",
      "b": "o zona de memorie (de pe stivă)",
      "c": "locul din textul sursă în care se apelează",
      "d": "instrucțiunile (definiția funcției)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 8",
    "imagine": ""
  },
  {
    "id": 94,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Care este valoarea variabilei n după execuția secvenței:",
    "cod_sursa": "char t[] = \"timisoara\", *p, *q, n;\np = q = t;\nwhile (*(q++));\nn = q - p;",
    "variante": {
      "a": "n=0",
      "b": "n=9",
      "c": "n=10",
      "d": "n=’\\0’-’t’"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 9",
    "imagine": ""
  },
  {
    "id": 95,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce reprezintă declarația următoare?\n\n(i) funcție ce primește argument pointer la întreg și întoarce pointer la întreg\n(ii) o declarație greșită\n(iii) pointer către o funcție care așteaptă ca argument un pointer la int și întoarce un pointer la int\n(iv) pointer către o funcție care întoarce un int",
    "cod_sursa": "int *(*f)(int *);",
    "variante": {
      "a": "i",
      "b": "ii",
      "c": "iii",
      "d": "iv",
      "e": "nici una",
      "f": "toate",
      "g": "i și iv"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 10",
    "imagine": ""
  },
  {
    "id": 96,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C",
    "enunt": "Ce se afișează în urma execuției următoarei secvențe de cod?",
    "cod_sursa": "#include<stdio.h>\nvoid main() {\nchar *u[2]={\"abc\",\"def\"}, **v;\nv=&u[0];\nprintf(\"%c\",(*v)[1]);\n}",
    "variante": {
      "a": "a",
      "b": "b",
      "c": "c",
      "d": "d",
      "e": "e",
      "f": "f",
      "g": "abc"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C, Pb. 11",
    "imagine": ""
  },
  {
    "id": 97,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Un constructor se caracterizează prin următoarele proprietăți în limbajele C++/Java:",
    "cod_sursa": "",
    "variante": {
      "a": "Este o funcție membră care are același nume ca și clasa în care este declarată",
      "b": "Este o funcție membră care întoarce o valoare",
      "c": "Este o funcție membră care nu are valoare de return",
      "d": "Este o funcție membră utilizată pentru a inițializa un obiect",
      "e": "Este o funcție membră utilizată pentru a dealoca spațiu de memorie",
      "f": "O clasă nu poate avea mai mult de un constructor"
    },
    "raspuns_corect": [
      "a",
      "c",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 1",
    "imagine": ""
  },
  {
    "id": 98,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Care dintre următoarele afirmații sunt adevărate despre template-uri(C++)/generice(Java)?",
    "cod_sursa": "",
    "variante": {
      "a": "Template-urile / genericele sunt o facilitate a limbajului care permit folosirea aceluiași cod\npentru diferite tipuri de date",
      "b": "Template-urile / genericele sunt exemple de polimorfism.",
      "c": "Template-urile / genericele nu pot fi folosite cu tipuri de date abstracte definite de utilizator.",
      "d": "În afară de template-urile / genericele implicite nu pot fi definite altele noi."
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 2",
    "imagine": ""
  },
  {
    "id": 99,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Care dintre următoarele afirmații sunt adevărate în limbajele C++/Java?",
    "cod_sursa": "",
    "variante": {
      "a": "O funcție statică nu poate arunca o excepție.",
      "b": "O funcție statică nu poate accesa o variabilă membru non-statică a clasei.",
      "c": "O funcție statică nu poate accesa o variabilă membru statică a clasei.",
      "d": "O variabilă membru statică a clasei nu poate fi modificată într-o funcție membră non-statică."
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 3",
    "imagine": ""
  },
  {
    "id": 100,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Excepțiile sunt:",
    "cod_sursa": "",
    "variante": {
      "a": "Erori care apar la compilarea programului",
      "b": "Situații speciale tratate în program prin teste de tipul if(variabila == NULL)",
      "c": "Erori care apar la rularea programului",
      "d": "’Aruncate’ folosind instrucțiunea try și ’tratate’ folosind instrucțiunea catch",
      "e": "’Aruncate’ folosind instrucțiunea throw(s) și ’tratate’ în blocuri try - catch (finally)"
    },
    "raspuns_corect": [
      "c",
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 4",
    "imagine": ""
  },
  {
    "id": 101,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Selectați afirmația corectă pentru instrucțiunea cout de mai jos:",
    "cod_sursa": "void f(list<string>& lst) {\n    list<string>::const_iterator x = find(lst.begin(), lst.end(), \"Timisoara\");\n    if (x == lst.end()) std::cout << \"_______________________\";\n}",
    "variante": {
      "a": "A gasit Timisoara",
      "b": "Nu a gasit Timisoara",
      "c": "Timisoara este ultimul element al listei",
      "d": "Timisoara este primul element al listei"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 5",
    "imagine": ""
  },
  {
    "id": 102,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Principiul OCP (Open Close Principle) din cadrul principiilor SOLID se referă la:",
    "cod_sursa": "",
    "variante": {
      "a": "Responsabilitățile pe care trebuie să le implementeze o clasă",
      "b": "Realizarea de ierarhii de clase consistente",
      "c": "Problemele care apar din cauza codului duplicat",
      "d": "Posibilitatea extinderii claselor și evitarea modificărilor claselor și codului existent"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 6",
    "imagine": ""
  },
  {
    "id": 103,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Care din următoarele afirmații sunt false în contextul supraîncărcării operatorilor în limbajul\nC++:",
    "cod_sursa": "",
    "variante": {
      "a": "Se pot adăuga noi operatori limbajului",
      "b": "Se poate schimba n-aritatea (numărul de operanzi ai operatorului)",
      "c": "Nu toți operatorii pot fi supraîncărcați",
      "d": "Operatorii se pot supraîncărca prin intermediul funcțiilor membre clasei și funcții prietene\nclasei."
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 7",
    "imagine": ""
  },
  {
    "id": 104,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "În limbajul C++, dacă o clasă X are ca membri variabile pointer, este recomandat să conțină:",
    "cod_sursa": "",
    "variante": {
      "a": "Un destructor care nu face nimic˜X(){}",
      "b": "O funcție friend care să permită copierea obiectului",
      "c": "Supraîncărcarea operatorului =",
      "d": "Constructorul de copiere",
      "e": "Supraîncărcarea operatorului ==",
      "f": "Un destructor în care se dealocă memoria adresată de membrii de tip pointer ai clasei"
    },
    "raspuns_corect": [
      "c",
      "d",
      "f"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 8",
    "imagine": ""
  },
  {
    "id": 105,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Se dă următoarea secvență de cod. De câte ori sunt apelați constructorii clasei Date?",
    "cod_sursa": "class Date {\npublic:\n    Date(int day=0, int month=0, int year=0);\n    Date(const Date& ref);\n};\n\nvoid g(Date d) { }\n\nvoid f() {\n    Date d{7, 3, 2007};\n    Date d1;\n    Date d2 = d;\n    d2 = d;\n    g(d);\n}",
    "variante": {
      "d": "5",
      "a": "2",
      "b": "3",
      "c": "4"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 9",
    "imagine": ""
  },
  {
    "id": 106,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul C++",
    "enunt": "Care din următoarele afirmații sunt adevărate?",
    "cod_sursa": "class Shape {\n    virtual void draw() = 0;\n};\nstruct Rectangle : Shape {\n    void addControlPoint(int x, int y);\n};\nint main() {\n    Rectangle c;\n    return 0;\n}",
    "variante": {
      "a": "clasa Rectangle nu poate fi instanțiată deoarece metoda addControlPoint() nu este implementată",
      "b": "clasa Rectangle nu poate fi instanțiată deoarece este clasă abstractă",
      "c": "codul se compilează cu succes"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: C++, Pb. 10",
    "imagine": ""
  },
  {
    "id": 107,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Dacă o metodă are ca parametru o referință la un obiect imutabil, de exemplu clasa String, poate\nmetoda să modifice starea obiectului?",
    "cod_sursa": "",
    "variante": {
      "a": "Da, dacă avem o referință la un obiect imutabil îi putem modifica starea",
      "b": "Da, dar trebuie să folosim un operator special \"+\" ca să realizăm acest lucru",
      "c": "Nu, starea obiectelor imutabile nu poate fi modificată de nimeni după ce obiectul a fost creat",
      "d": "Nu, doar proprietarul obiectului imutabil poate să îi schimbe starea."
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 1",
    "imagine": ""
  },
  {
    "id": 108,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care dintre afirmațiile de mai jos este adevărată în relație cu limbajul Java?",
    "cod_sursa": "",
    "variante": {
      "a": "Specificatorulfinalse aplică la clase, atribute si metode;",
      "b": "O metodă declaratăfinalpoate apela doar metode declarate final în aceeași clasă;",
      "c": "O metodă declaratăfinalnu poate fi suprascrisă la subclasare;",
      "d": "Un atribut declaratfinalpoate fi setat doar o singură dată;"
    },
    "raspuns_corect": [
      "a",
      "c",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 2",
    "imagine": ""
  },
  {
    "id": 109,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care dintre afirmațiile de mai jos este/sunt adevărată/e despre conceptul de moștenire între clase?",
    "cod_sursa": "",
    "variante": {
      "a": "Mecanismul prin care o clasă preia structura (datele membru) și comportamentul (metodele)\nunei alte clase la care adaugă elemente specifice;",
      "b": "Prin mecanismul de moștenire avem acces la datele private ale clasei(claselor) de bază;",
      "c": "Nu toate limbajele de programare implementează conceptul de moștenire multiplă;",
      "d": "O metodă definită în clasa de bază nu poate fi suprascrisă în clasa derivată;",
      "e": "Moștenirea poate fi întotdeauna înlocuită cu compunerea obiectelor."
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 3",
    "imagine": ""
  },
  {
    "id": 110,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care dintre afirmațiile de mai jos este/sunt adevărată/e referitor la conceptul de clasă abstractă\nîn limbajul Java:",
    "cod_sursa": "",
    "variante": {
      "a": "O clasă care nu poate fi instanțiată;",
      "b": "Nu există nicio diferență între clasele abstracte și interfețe;",
      "c": "O clasă abstractă poate conține variabile membre care nu sunt constante."
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 4",
    "imagine": ""
  },
  {
    "id": 111,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care dintre afirmațiile de mai jos sunt adevărate despre clase și obiecte:",
    "cod_sursa": "",
    "variante": {
      "a": "O clasă modelează caracteristici comune mai multor obiecte;",
      "b": "Un obiect este o realizare/instanță a unei clase;",
      "c": "O clasă este o realizare/instanță a unui obiect;",
      "d": "Nu există nicio legătură între clase și obiecte."
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 5",
    "imagine": ""
  },
  {
    "id": 112,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care din următoarele afirmații sunt false relativ la limbajul Java:",
    "cod_sursa": "",
    "variante": {
      "a": "Orice clasă este derivată din clasa Object",
      "b": "O clasă poate extinde una sau mai multe clase de bază",
      "c": "O clasă poate implementa una sau mai multe interfețe",
      "d": "Subclasele moștenesc atributele, metodele și constructorii clasei de bază"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 6",
    "imagine": ""
  },
  {
    "id": 113,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Care din următoarele afirmații este/sunt adevărate despre clasa PreparedStatement?",
    "cod_sursa": "",
    "variante": {
      "a": "interogarea este compilată de fiecare dată când este executată",
      "b": "permite rularea aceleiași interogări, prin compilarea ei o singură dată și parametrizarea cu\nvalori diferite",
      "c": "folosirea clasei PreparedStatement evită întotdeauna SQL Injection",
      "d": "SQL Injection poate fi evitat prin folosirea placeholderului \"?\""
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 7",
    "imagine": ""
  },
  {
    "id": 114,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Două funcții care au același nume într-o clasă Java, pot fi diferențiate datorită:",
    "cod_sursa": "",
    "variante": {
      "a": "Numărului de variabile din lista de parametri",
      "b": "Nu pot fi diferențiate",
      "c": "Tipului variabilelor din lista de variabile",
      "d": "Tipului de return al funcției"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 8",
    "imagine": ""
  },
  {
    "id": 115,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Se consideră următoarea secvență de cod. Care din variantele de mai jos instantiază și lansează în execuție un fir de execuție de tipul clasei A?",
    "cod_sursa": "class A implements Runnable {\n    int counter = 0;\n    public void run() {\n        while (true) counter ++;\n    }\n}\n\npublic class Test {\n    public static void main(String [] arg) {\n        A a = new A();\n    }\n}",
    "variante": {
      "a": "(new Thread()).start()",
      "b": "Thread a = new Thread(new A()); a.start( );",
      "c": "A a = new A(); a.run( );",
      "d": "new Thread.run( );"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 9",
    "imagine": ""
  },
  {
    "id": 116,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Considerând următoarea secvență de cod, stabiliți care este ordinea execuției (în ipoteza că o clasă are un constructor, o metodă, un bloc static și un bloc de instanță):",
    "cod_sursa": "public class A {\n    public A() {\n        System.out.print(\"constructor; \");\n    }\n    public void method() {\n        System.out.print(\"method; \");\n    }\n    {\n        System.out.print(\"instance block; \");\n    }\n    static {\n        System.out.print(\"static block; \");\n    }\n    public static void main(String[] args) {\n        A a = new A();\n        a.method();\n    }\n}",
    "variante": {
      "a": "instance block; method; static block; constructor;",
      "b": "static block; instance block; constructor; method;",
      "c": "method; constructor; instance block; static block;",
      "d": "static block; method; instance block; constructor;",
      "e": "constructor; static block; instance block; method;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 10",
    "imagine": ""
  },
  {
    "id": 117,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Limbajul Java",
    "enunt": "Se consideră următoarea secvență de cod:",
    "cod_sursa": "public class Main {\npublic static void main(String[] args) {\nSet<String> fructe = new TreeSet<>(Arrays.asList(\"mere\", \"pere\",\n\"banane\", \"mere\", \"kiwi\", \"ananas\", \"portocale\"));\nSystem.out.println(fructe);\n}\n}\nCare din variantele de mai jos se va afișa:",
    "variante": {
      "a": "[mere, pere, banane, kiwi, ananaș portocale]",
      "b": "[ananaș banane, kiwi, mere, pere, portocale]",
      "c": "[Ljava.lang.String; @15db9742]",
      "d": "[portocale, ananaș kiwi, mere, banane, pere]\nProiectarea aplicațiilor software"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Java, Pb. 11",
    "imagine": ""
  },
  {
    "id": 118,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Verificarea software-lui poate implica",
    "cod_sursa": "",
    "variante": {
      "a": "analiza statică automată",
      "b": "evaluarea utilității și utilizabilității software-lui în situații operaționale.",
      "c": "depanarea erorilor",
      "d": "inspectări ale software-lui",
      "e": "testarea în vederea descoperirii existenței erorilor",
      "f": "testarea faptului că software-ul îndeplinește cerințele utilizator"
    },
    "raspuns_corect": [
      "a",
      "d",
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 1",
    "imagine": ""
  },
  {
    "id": 119,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Diagrama de stări și tranziții reprezintă",
    "cod_sursa": "",
    "variante": {
      "a": "funcțiile sistemului",
      "b": "răspunsul sistemului la evenimente interne",
      "c": "răspunsul sistemului la evenimente externe",
      "d": "interacțiuni între obiecte din sistem",
      "e": "structura datelor",
      "f": "interacțiunile actorilor cu sistemul",
      "g": "fluxul de prelucrare a datelor în sistem"
    },
    "raspuns_corect": [
      "b",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 2",
    "imagine": ""
  },
  {
    "id": 120,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Metodele agile de dezvoltare de software implică",
    "cod_sursa": "",
    "variante": {
      "a": "Furnizare incrementală",
      "b": "Implicarea clientului pe parcursul procesului de dezvoltare",
      "c": "Instituirea de procese normative pentru lucrul în echipă",
      "d": "Acțiuni periodice de eliminare a complexității din sistem",
      "e": "Modelarea completă a software-lui înainte de scrierea codului"
    },
    "raspuns_corect": [
      "a",
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 3",
    "imagine": ""
  },
  {
    "id": 121,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Bifați situațiile in care se reutilizează doar concepte:",
    "cod_sursa": "",
    "variante": {
      "a": "Servicii software",
      "b": "Șabloane de proiectare (design patterns)",
      "c": "Biblioteci de programe",
      "d": "Șabloane arhitecturale"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 4",
    "imagine": ""
  },
  {
    "id": 122,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de clase.\nBifați afirmațiile adevărate.",
    "cod_sursa": "",
    "variante": {
      "a": "Un obiect de tip ComputerScience conține o colecție de obiecte de tip Student",
      "b": "Clasa Questionnaire are un atribut public de tip String",
      "c": "Clasa ComputerScience are operația publică addStudent(s:Student)",
      "d": "Clasa ComputerScience are operația privată setSchedule(s:String)",
      "e": "Clasa Tutor este superclasă pentru clasa Masterand",
      "f": "Clasa ComputerScience definește o compoziție de obiecte de tip Questionnaire.",
      "g": "Între clasa ComputerScience și clasa Tutor există o asociere unidirecțională.",
      "h": "Clasa ComputerScience moștenește interfața Specialization.",
      "i": "Clasa Tutor definește un agregat de obiecte de tip Masterand."
    },
    "raspuns_corect": [
      "a",
      "c",
      "e",
      "f"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 5",
    "imagine": "diagrame/diagrame_122.png"
  },
  {
    "id": 123,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de clase.\nCare secvență de cod Java descrie corect și complet relațiile clasei Proiect?",
    "cod_sursa": "",
    "variante": {
      "a": "class Proiect extends Student {\nprivate Collection <DiagramaUML> diagramele = new ArrayList<>();\nprivate CodSursa codul;\n...}",
      "b": "class Proiect {\nprivate Collection <Student> studenti;\nprivate Collection <DiagramaUML> diagramele = new ArrayList<>();\nprivate CodSursa codul;\n...}",
      "c": "class Proiect {\nprivate Student student;\nprivate DiagramaUML diagrama;\nprivate CodSursa codul;\n...}",
      "d": "class Proiect {\nprivate Collection <Student> studenti = new ArrayList<>();\nprivate Collecction <DiagramaUML> diagramele;\nprivate CodSursa codul;\n...}"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 6",
    "imagine": "diagrame/diagrame_123.png"
  },
  {
    "id": 124,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de clase.\nCare secvență de cod Java descrie corect și complet relațiile clasei Revista?",
    "cod_sursa": "",
    "variante": {
      "a": "class Revista extends RevistaOnLine implements Produs {\nprivate Collection <Articol> articole;\n...}",
      "b": "class Revista implements Produs {\nprivate Collection <Articol> articole = new LinkedList<>();\nprivate RevistaOnLine revista;\n...}",
      "c": "class Revista implements Produs {\nprivate Collection <Articol> articole = new LinkedList<>();\n...}",
      "d": "class Revista extends RevistaOnLine {\nprivate Collection <Articol> articole = new LinkedList<>();\nprivate Produs produs;\n...}"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 7",
    "imagine": "diagrame/diagrame_124.png"
  },
  {
    "id": 125,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de clase.\nSelectați descrierea corectă și completă a relațiilor reprezentate în diagramă:",
    "cod_sursa": "",
    "variante": {
      "a": "Asociere bidirecțională, între claseleProiectșiCodSursa; compoziție între claseleProiect\n(compozit)șiDiagramaUML(componenta); agregareîntreclaseleProiect(agregat)s ,iStudent\n(componenta); generalizare între interfațaIStudent(implementată) și clasaStudent(imple-\nmentează); realizare între clasaStudent(superclasa) și clasaBursier(subclasa)",
      "b": "Asociere bidirecțională, între claseleProiectșiCodSursa; compoziție între claseleProiect\n(compozit)șiDiagramaUML(componenta); agregareîntreclaseleProiect(agregat)s ,iStudent\n(componenta); realizare între interfațaIStudent(implementată) s ,i clasaStudent(imple-\nmentează); generalizare între clasaStudent(superclasa) și clasaBursier(subclasa)",
      "c": "Asociere bidirecțională, între claseleProiects ,iCodSursa; agregare între claseleProiect\n(agregat)șiDiagramaUML(componenta); compozițieîntreclaseleProiect(agregat)s ,iStudent\n(componenta); realizare între interfațaIStudent(implementată) s ,i clasaStudent(imple-\nmentează); generalizare între clasaStudent(superclasa) și clasaBursier(subclasa)",
      "d": "Asocierebidirecțională, întreclaseleProiects ,iCodSursa; compozițieîntreclaseleDiagramaUML\n(compozit) șiProiect(componenta); agregare între claseleStudent(agregat) s ,iProiect\n(componenta); realizare între interfațaIStudent(implementată) s ,i clasaStudent(imple-\nmentează); generalizare între clasaStudent(superclasa) și clasaBursier(subclasa)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 8",
    "imagine": "diagrame/diagrame_125.png"
  },
  {
    "id": 126,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de clase.\nCare secvență de cod Java descrie corect și complet relația clasei Proiect cu clasa Student?",
    "cod_sursa": "",
    "variante": {
      "a": "class Student extends Proiect{...}\nclass Proiect{...}",
      "b": "class Proiect extends Student{...}\nclass Student{...}",
      "c": "class Proiect {\nprivate Collection <Student> studenti ...}\nclass Student{...}",
      "d": "class Proiect {\nprivate Collection <Student> studenti ...}\nclass Student {\nprivate Proiect proiect;\n...}",
      "e": "class Proiect {\nprivate Collection <Student> studenti ...}\nclass Student {\nprivate Collection<Proiect> proiecte;\n...}"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 9",
    "imagine": "diagrame/diagrame_126.png"
  },
  {
    "id": 127,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de secvențe.\nCe operații ale clasei ControlerInscriere rezultă din aceasta?",
    "cod_sursa": "",
    "variante": {
      "a": "getCursuri()",
      "b": "display(listaCursuriOferite)",
      "c": "inscriere(student, listaCursuriSelectate)",
      "d": "Plan(listaCursuriSelectate)",
      "e": "addPlan(planCurent)",
      "f": "displayMsg(”OK”)"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 10",
    "imagine": "diagrame/diagrame_127.png"
  },
  {
    "id": 128,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de secvențe.\nSelectați clasele din care sunt instanțiate obiectele implicate în interacțiune:",
    "cod_sursa": "",
    "variante": {
      "a": "InscriereForm",
      "b": "ControlerInscriere",
      "c": "listaCursuriSelectate",
      "d": "curent",
      "e": "Student",
      "f": "Plan",
      "g": "planCurent"
    },
    "raspuns_corect": [
      "a",
      "b",
      "e",
      "f"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 11",
    "imagine": "diagrame/diagrame_128.png"
  },
  {
    "id": 129,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Fie următoarea diagramă de robustețe.\nCare afirmații sunt adevărate?",
    "cod_sursa": "",
    "variante": {
      "a": "Home pageeste obiectboundary.",
      "b": "ExtrageListaCartipoate fi obiect persistent.",
      "c": "AfiseazaLinkurieste obiect de interacțiune cu actor.",
      "d": "ExtrageListaCartiar putea fi implementat ca metodă a unei claseentity.",
      "e": "ListaCartieste obiect de interacțiune cu actor.",
      "f": "Catalogeste obiectentity."
    },
    "raspuns_corect": [
      "a",
      "d",
      "f"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 12",
    "imagine": "diagrame/diagrame_129.png"
  },
  {
    "id": 130,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Selectați perechea de termeni cu care se înlocuiesc spațiile libere din următoarea frază:\n\"În jocul Essence ‘Checkpoint construction’, un checkpoint este un set de. . . . . .ce trebuie îndeplinite la un anume moment în timp, în cadrul unui efort de dezvoltare de software, ȘI este\ndefinit în termeni de. . . . . ..\"",
    "cod_sursa": "",
    "variante": {
      "a": "criterii / activități",
      "b": "componente / roluri",
      "c": "alphas / activity spaces",
      "d": "criterii / alpha states",
      "e": "alpha states / criterii"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 13",
    "imagine": ""
  },
  {
    "id": 131,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Realizați corespondența corectă între concept și definiția sa:",
    "cod_sursa": "",
    "variante": {
      "a": "a – 5, b – 1, c – 4, d – 3, e – 2",
      "b": "a – 5, b – 3, c – 4, d – 1, e – 2",
      "c": "a – 2, b – 1, c – 3, d – 4, e – 5",
      "d": "a – 1, b – 2, c – 3, d – 4, e – 5",
      "e": "a – 3, b – 2, c – 4, d – 5, e –"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 14",
    "imagine": "diagrame/diagrame_131.png"
  },
  {
    "id": 132,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Proiectarea aplicațiilor software",
    "enunt": "Selectați metodele de evitare a introducerii de erori în dezvoltarea de programe:",
    "cod_sursa": "",
    "variante": {
      "a": "Fiecare clasă trebuie să aibă o singură reponsabilitate",
      "b": "Folosire expresii regulate pentru validarea datelor de intrare",
      "c": "Evitarea încuibării multiple de instrucțiuni condiționale",
      "d": "Jurnalizarea interacțiunii utilizatorilor cu programul",
      "e": "Înlocuirea corpului unei metode cu un nou algoritm mai clar care returnează același rezultat",
      "f": "Minimizarea adâncimii ierahiilor de clase",
      "g": "Salvare automată a datelor utilizatorului la intervale presetate",
      "h": "Identificarea aspectelor care variază ale unei aplicații și separarea lor de cele care nu variază",
      "i": "Verificare valori date de intrare față de domeniul definit cu reguli de intrare",
      "j": "Folosire aserțiuni pentru verificare rezultat de la un serviciu extern"
    },
    "raspuns_corect": [
      "a",
      "c",
      "e",
      "f",
      "h"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Proiectarea aplicațiilor software, Pb. 15",
    "imagine": ""
  },
  {
    "id": 133,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Se consideră tabela R(A) conținând înregistrările {(1), (2)} și tranzacțiile T1 și T2. Dacă tranzacția T2 se execută folosind nivelul de izolare repeatable read, care dintre următoarele afirmații este adevărată?",
    "cod_sursa": "(T1) UPDATE R SET A = A * 2\n(T2) SELECT AVG(A) FROM R; SELECT MAX(A) FROM R",
    "variante": {
      "a": "Dacă AVG(A) = 1.5 atunci MAX(A) poate să ia valorile 2 sau 4",
      "b": "AVG(A) va fi întodeauna 1.5 iar MAX(A) = 2",
      "c": "AVG(A) poate să ia valorile 1.5 sau 3, iar MAX(A) valorile 2 sau 4",
      "d": "Dacă MAX(A) = 4 atunci AVG(A) este 1.5"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 1",
    "imagine": ""
  },
  {
    "id": 134,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Trei dintre expresiile relaționale de mai jos returnează numele studenților care nu au aplicat\nla specializările CS sau PH. Care returnează altceva? (Observație: numele studenților pot fi\nduplicate.)",
    "cod_sursa": "",
    "variante": {
      "a": "π sName (Student ⋈ (π sID(Student) − (π sID(σ major='CS' Apply) ∪ π sID(σ major='PH' Apply))))",
      "b": "π sName (Student ⋈ (π sID Student − π sID(σ major='CS' ∨ major='PH' Apply)))",
      "c": "π sName (π sID, sName Student − π sID, sName (Student ⋈ π sID(σ major='CS' ∨ major='PH' Apply)))",
      "d": "π sName Student − π sName (Student ⋈ π sID(σ major='CS' ∨ major='PH' Apply))"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 2",
    "imagine": ""
  },
  {
    "id": 135,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Tabelul de mai jos conține un eșantion de date reprezentativ pentru toate dependențele funcționale dintr-un set de date real. Care sunt dependențele funcționale ce pot fi extrase din aceste date?",
    "cod_sursa": "",
    "variante": {
      "a": "A→{B, C}, E→{F}",
      "b": "D→{A, B, C, E, F}, F→{E}",
      "c": "{A, E}→{D}",
      "d": "{D, E}→{A, B}"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 3",
    "imagine": "diagrame/diagrame_135.png"
  },
  {
    "id": 136,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Considerând relația R(A, B, C, D, E, F) unde A - F sunt coloanele din tabelul de mai sus și\ndependențele funcționale tot cele de mai suș care dintre următoarele seturi de atribute este cheie\ncandidată?",
    "cod_sursa": "",
    "variante": {
      "a": "{B, F}",
      "b": "{A, E}",
      "c": "{A, E, D}",
      "d": "{A}"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 4",
    "imagine": ""
  },
  {
    "id": 137,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Relativ la relația R de mai suș care dintre următoarele afirmații sunt false?",
    "cod_sursa": "",
    "variante": {
      "a": "Relația se află în prima formă normală",
      "b": "Relația se află în a doua formă normală",
      "c": "La o adresă (coloana B) nu pot corespunde valori diferite în coloana A",
      "d": "Nu pot exista două înregistrări în tabela R cu valori diferite în coloana D dacă valorile din\ncoloana A sunt identice"
    },
    "raspuns_corect": [
      "b",
      "c",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 5",
    "imagine": ""
  },
  {
    "id": 138,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Fie următoarea diagramă E/R.\nCare dintre următoarele relații fac parte din reprezentarea acestei diagrame în modelul relațional?",
    "cod_sursa": "",
    "variante": {
      "a": "Courses(CID, title)",
      "b": "Students(SID, name)",
      "c": "Enroll(SID,CID)",
      "d": "Enroll(SID, name, CID, title, grade)",
      "e": "Students(SID, name, CID)",
      "f": "Enroll(SID, CID, grade)"
    },
    "raspuns_corect": [
      "a",
      "b",
      "f"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 6",
    "imagine": "diagrame/diagrame_138.png"
  },
  {
    "id": 139,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Presupunem că în tabela EMPLOYEES sunt 10 angajați care au salarii de 1000 euro fiecare, cu excepția unuia care are valoarea NULL și că primii 5 angajați lucrează în departamentul 1 și ceilalți 5 angajați în departamentul 2. Câte linii va afișa interogarea următoare:",
    "cod_sursa": "SELECT department_id, SUM(salary)\nFROM employees\nGROUP BY department_id\nHAVING SUM(NVL(salary,1000)) > 4000;",
    "variante": {
      "a": "Nicio linie",
      "b": "O linie",
      "c": "Două linii",
      "d": "Un alt răspuns"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 7",
    "imagine": ""
  },
  {
    "id": 140,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Care dintre interogările de mai jos selectează identificatorul (ID) și numele departamentelor care\nnu au angajați? Coloana DEPARTMENT_ID este comună tabelelor EMPLOYEES și DEPARTMENTS.",
    "cod_sursa": "",
    "variante": {
      "a": "SELECT d.department_id, d.department_name\nFROM departments d\nWHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id=d.department_id);",
      "b": "SELECT d.department_id, d.department_name\nFROM employees e LEFT OUTER JOIN departments d\nON (d.department_id=e.department_id) WHERE e.department_id IS NULL;",
      "c": "SELECT d.department_id, d.department_name\nFROM employees e RIGHT OUTER JOIN departments d\nON (d.department_id=e.department_id) WHERE e.department_id IS NULL;",
      "d": "SELECT department_id, department_name\nFROM departments\nMINUS\nSELECT d.department_id, d.department_name\nFROM employees e JOIN departments d ON e.department_id=d.department_id;"
    },
    "raspuns_corect": [
      "a",
      "c",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 8",
    "imagine": ""
  },
  {
    "id": 141,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Dacă se dorește afișarea tuturor locațiilor care nu au niciun departamenț precum și a departamentelor care nu au fost asignate niciunei locații, ce tip de JOIN între tabelele DEPARTMENTS\nși LOCATIONS va afișa aceste informații ca parte din liniile returnate?",
    "cod_sursa": "",
    "variante": {
      "a": "NATURAL JOIN",
      "b": "FULL OUTER JOIN",
      "c": "LEFT OUTER JOIN",
      "d": "RIGHT OUTER JOIN"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 9",
    "imagine": ""
  },
  {
    "id": 142,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Care dintre afirmațiile referitoare la indecși sunt corecte?",
    "cod_sursa": "",
    "variante": {
      "a": "Când un tabel este șterș indecșii corespunzători acestuia sunt șterși automat.",
      "b": "Pentru fiecare operație DML realizată, indecșii corespunzători sunt actualizați automat.",
      "c": "Indecșii se recomandă a fi creați pentru coloane care sunt în mod frecvent referite ca parte a\nunei expresii.",
      "d": "Pentru fiecare constrângere de cheie primară sau cheie unică (PRIMARY KEY sau UNIQUE)\ndintr-un tabel se creează automat un index unic."
    },
    "raspuns_corect": [
      "a",
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 10",
    "imagine": ""
  },
  {
    "id": 143,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Prin următoarea instrucțiune SQL se dorește a regăsi liniile din tabelul ORDER_ITEMS aferente produselor identificate prin PRODUCT_ID care au un UNIT_PRICE mai mare decât 1000 și care au fost comandate de mai mult de 5 ori. Care afirmații sunt adevărate cu privire la instrucțiunea SQL:",
    "cod_sursa": "SELECT product_id, COUNT(order_id) total, unit_price\nFROM order_items\nWHERE unit_price > 1000 AND COUNT(order_id) > 5\nGROUP BY product_id, unit_price;",
    "variante": {
      "a": "Instrucțiunea se execută și furnizează rezultatul așteptat.",
      "b": "Instrucțiunea nu se execută întrucât funcția de agregare este utilizată în clauza WHERE.",
      "c": "Instrucțiunea ar trebui să utilizeze operatorul logic OR în loc de AND.",
      "d": "Instrucțiunea nu se execută deoarece în clauza SELECT coloana UNIT_PRICE este adău-\ngată după coloana pentru care este utilizată funcția de agregare."
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 11",
    "imagine": ""
  },
  {
    "id": 144,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Se dorește afișarea coloanelor FIRST_NAME și SALARY aferente angajaților din tabelul EMPLOYEES care au același șef (MANAGER_ID) cu al angajatului identificat prin EMPLOYEE_ID = 101 și care au un salariu mai mare sau egal cu al aceluiași angajat identificat prin EMPLOYEE_ID = 101. Care dintre interogările următoare vor afișa rezultatul dorit?",
    "cod_sursa": "",
    "variante": {
      "a": "SELECT first_name, salary\nFROM employees\nWHERE (manager_id, salary) >= ALL (SELECT manager_id, salary\nFROM employees WHERE employee_id = 101)\nAND employee_id <> 101;",
      "b": "SELECT first_name, salary\nFROM employees\nWHERE (manager_id, salary) >= ( SELECT manager_id, salary\nFROM employees\nWHERE employee_id = 101)\nAND employee_id <> 101;",
      "c": "SELECT first_name, salary\nFROM employees\nWHERE (manager_id, salary) >= ANY (SELECT manager_id, salary\nFROM employees\nWHERE employee_id = 101 AND employee_id <> 101);",
      "d": "SELECT first_name, salary\nFROM employees\nWHERE manager_id = (SELECT manager_id\nFROM employees\nWHERE employee_id = 101)\nAND salary >= (SELECT salary\nFROM employees\nWHERE employee_id = 101)\nAND employee_id <> 101;",
      "e": "SELECT e.first_name, e.salary\nFROM employees e, employees m\nWHERE m.employee_id = 101 AND e.manager_id = m.manager_id\nAND e.salary >= m.salary AND e.employee_id <> m.employee_id;"
    },
    "raspuns_corect": [
      "d",
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 12",
    "imagine": ""
  },
  {
    "id": 145,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Evaluați următoarea instrucțiune CREATE TABLE. Care afirmații sunt adevărate cu privire la constrângerea PROD_ID_PK?",
    "cod_sursa": "CREATE TABLE products\n(\n  product_id NUMBER(6) CONSTRAINT prod_id_pk PRIMARY KEY,\n  product_name VARCHAR2(15)\n);",
    "variante": {
      "a": "Ar fi creată numai dacă în prealabil este creat manual un index unic.",
      "b": "Ar fi creată și ar folosi un index unic creat automat.",
      "c": "Ar fi creată și ar folosi un index non-unic creat automat.",
      "d": "Ar fi creată și ar rămâne în stare dezactivată deoarece nu e specificat explicit niciun index\nîn comandă."
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 13",
    "imagine": ""
  },
  {
    "id": 146,
    "materie": "Limbaje de programare și inginerie software",
    "subcategorie": "Baze de date",
    "enunt": "Fiind dată vederea V de mai jos, în ce condiții comanda SQL de mai jos va genera o excepție cauzată de constrângerea WITH CHECK OPTION?",
    "cod_sursa": "UPDATE V SET Curs = 'Baze de date II' WHERE ID=101;\n\nCREATE VIEW V(ID, Curs, EDate) AS\nSELECT StudID, CourseTitle, EnrollmentDate\nFROM Enrollments\nWHERE CourseTitle='Algebra' AND Accepted=1\nWITH CHECK OPTION;",
    "variante": {
      "a": "Întotdeauna datorită WITH CHECK OPTION",
      "b": "Dacă studentul cu ID-ul 101 a fost acceptat la cursul de Algebra",
      "c": "Dacă studentul cu ID-ul 101 a fost acceptat la cursul de Baze de date II",
      "d": "Dacă studentul cu ID-ul 101 a aplicat la cursul de Algebră (indiferent de starea câmpului\nAccepted)"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 2: Baze de date, Pb. 14",
    "imagine": ""
  },
  {
    "id": 147,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Registrul Program Contor conține:",
    "cod_sursa": "",
    "variante": {
      "a": "adresa următoarei instrucțiuni din memorie",
      "b": "adresa datelor extrase din memorie",
      "c": "rezultatul operațiilor aritmetice efectuate",
      "d": "adresa de unde va fi extrasă instrucțiunea ce urmează a fi executată"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 1",
    "imagine": ""
  },
  {
    "id": 148,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Timpul mediu necesar pentru a accesa o locație de memorie și a prelua conținutul acesteia poartă\nnumele de:",
    "cod_sursa": "",
    "variante": {
      "a": "timp de latență",
      "b": "timp de căutare",
      "c": "timp de acces",
      "d": "timp de răspuns"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 2",
    "imagine": ""
  },
  {
    "id": 149,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Tipul de memorie folosit pentru a crește viteza de procesare a unui calculator este:",
    "cod_sursa": "",
    "variante": {
      "a": "RAM",
      "b": "Cache",
      "c": "BIOS",
      "d": "ROM"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 3",
    "imagine": ""
  },
  {
    "id": 150,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Suma dintre -6 și – 13, folosind reprezentarea în complement față de 2, este:",
    "cod_sursa": "",
    "variante": {
      "a": "11101101",
      "b": "11100001",
      "c": "01010101",
      "d": "10101011"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 4",
    "imagine": ""
  },
  {
    "id": 151,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Care este valoarea stocată la adresa c după executarea următoarei secvențe de cod?",
    "cod_sursa": "x     DATA 4B\ny     DATA F\nc     DATA 0\nstart LDA x\n      CMP y\n      JGE adr1\n      ADD y\n      STA c\n      JMP adr2\nadr1  SUB y\n      STA c\nadr2  STOP\n      END start",
    "variante": {
      "a": "3C 16",
      "b": "20 8",
      "c": "59 10",
      "d": "111100"
    },
    "raspuns_corect": [
      "a",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 5",
    "imagine": ""
  },
  {
    "id": 152,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Ce tehnică ajută procesorul să ruleze un program concomitent cu operațiile de intrare/ieșire?",
    "cod_sursa": "",
    "variante": {
      "a": "DMA",
      "b": "transfer prin program",
      "c": "niciunul dintre răspunsuri",
      "d": "transfer prin întreruperi"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 6",
    "imagine": ""
  },
  {
    "id": 153,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Care este cea mai mare unitate de transfer a datelor din memoria unui sistem de calcul?",
    "cod_sursa": "",
    "variante": {
      "a": "cuvânt",
      "b": "bloc",
      "c": "bit",
      "d": "niciuna dintre acestea"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 7",
    "imagine": ""
  },
  {
    "id": 154,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Pentru un număr dat/fix de biți, numărul de valori distincte care pot fi reprezentate este:",
    "cod_sursa": "",
    "variante": {
      "a": "mai mare pentru întregi fără semn",
      "b": "mai mare pentru întregi cu semn",
      "c": "același pentru întregi cu semn și întregi fără semn"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 8",
    "imagine": ""
  },
  {
    "id": 155,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Diferența între procesoarele CISC și RISC constă în:",
    "cod_sursa": "",
    "variante": {
      "a": "procesoarele CISC au un număr mai mare de instrucțiuni",
      "b": "procesoarele RISC prezintă riscuri mai mari în utilizare",
      "c": "procesoarele RISC execută o instrucțiune într-un singur ciclu"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 9",
    "imagine": ""
  },
  {
    "id": 156,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "O întrerupere hardware reprezintă:",
    "cod_sursa": "",
    "variante": {
      "a": "un semnal sincron/asincron la un periferic care semnalizează apariția unui eveniment care\ntrebuie tratat de către procesor",
      "b": "întreruperea funcționării procesorului în urma unui bug software",
      "c": "întreruperea unui circuit de conectare între două sau mai multe componente hardware"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 10",
    "imagine": ""
  },
  {
    "id": 157,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Arhitectura Harvard are:",
    "cod_sursa": "",
    "variante": {
      "a": "două magistrale, una pentru date și una pentru instrucțiuni",
      "b": "două memorii, una pentru date și una pentru instrucțiuni/program",
      "c": "drept dezavantaj major faptul că magistrala de date este mai ocupată decât magistrala de\nprogram"
    },
    "raspuns_corect": [
      "a",
      "b",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 11",
    "imagine": ""
  },
  {
    "id": 158,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "La magistralele sincrone:",
    "cod_sursa": "",
    "variante": {
      "a": "ciclurile de transfer sunt direct corelate cu semnalul de tact (CPU clock)",
      "b": "nu există o legatură directă între evoluția în timp a unui ciclu de transfer și semnalul de tact\nal ceasului procesorului",
      "c": "se face permanent o sincronizare a acestora cu magistralele asincrone"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 12",
    "imagine": ""
  },
  {
    "id": 159,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "O poartă logică este:",
    "cod_sursa": "",
    "variante": {
      "a": "un program software capabil sa efectueze o anumită operație (logică) asupra unor semnale\nelectrice",
      "b": "un conector care permite preluarea valorilor logice de la utilizator",
      "c": "un dispozitiv hardware capabil să efectueze o anumită operație (logică) asupra unor semnale\nelectrice"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 13",
    "imagine": ""
  },
  {
    "id": 160,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Circuitele de memorare SR-latch (S-Seț R-Reset):",
    "cod_sursa": "",
    "variante": {
      "a": "Stochează o singură valoare binară",
      "b": "Ieșirile celor două porți logice folosite pentru realizare sunt tot timpul complementare",
      "c": "Setează si resetează în mod continuu valorile numerice stocate"
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 14",
    "imagine": ""
  },
  {
    "id": 161,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Circuit combinațional:",
    "cod_sursa": "",
    "variante": {
      "a": "Este un circuit format din porți logice, care nu are memorie și al cărui output depinde doar\nde inputul prezent/curenț NU de inputul precedent sau de starea curentă în care se afla\ncircuitul",
      "b": "Este un circuit electric in care informațiile sunt combinate în mod aleator pentru a obține\nvalori aleatoare",
      "c": "Este un circuit care transpus într-un graf nu conține cicluri"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 15",
    "imagine": ""
  },
  {
    "id": 162,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Procesoarele RISC se deosebesc de procesoarele CISC prin:",
    "cod_sursa": "",
    "variante": {
      "a": "un număr mai mare de regiștrii",
      "b": "mai multe moduri de adresare a memoriei",
      "c": "mai puține moduri de adresare a memoriei",
      "d": "execuția mai rapidă a operațiilor aritmetice și logice"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 16",
    "imagine": ""
  },
  {
    "id": 163,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Un circuit de memorare de tip SR-latch:",
    "cod_sursa": "",
    "variante": {
      "a": "poate fi realizat numai cu porți NAND",
      "b": "poate stoca o valoare de tip real",
      "c": "poate stoca doar o valoare de tip Boolean"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 17",
    "imagine": ""
  },
  {
    "id": 164,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Un microprocesor îndeplinește următoarele funcții:",
    "cod_sursa": "",
    "variante": {
      "a": "manipulare informații (instrucțiuni, date transmise, date primite)",
      "b": "execuție operații de calcul",
      "c": "control și supervizare",
      "d": "verificare semantică a unui program software"
    },
    "raspuns_corect": [
      "a",
      "b",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 18",
    "imagine": ""
  },
  {
    "id": 165,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Semnalele unui microprocesor sunt",
    "cod_sursa": "",
    "variante": {
      "a": "semnale de întrerupere",
      "b": "semnale pentru arbitrarea magistralei",
      "c": "semnale de verificare conexiune Internet"
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 19",
    "imagine": ""
  },
  {
    "id": 166,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "În cazul unei magistrale sincrone:",
    "cod_sursa": "",
    "variante": {
      "a": "producerea unui eveniment depinde de producerea evenimentului anterior;",
      "b": "toate dispozitivele conectate la magistrală pot citi linia de sincronizare",
      "c": "doar dispozitivele de intrare conectate la magistrală pot citi linia de sincronizare"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 20",
    "imagine": ""
  },
  {
    "id": 167,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "În cazul familiei de procesoare x86, registrul pointer de instrucțiuni (IP – Instruction Pointer)",
    "cod_sursa": "",
    "variante": {
      "a": "conține adresa primei instrucțiuni de executat dintr-un program",
      "b": "nu poate fi modificat sau citit în mod direct",
      "c": "indică adresa de deplasament plecând de la adresa conținută în registrul CS (adresa de baza)"
    },
    "raspuns_corect": [
      "b",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 21",
    "imagine": ""
  },
  {
    "id": 168,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Care este rolul unității de comandă și control în cadrul UCP?",
    "cod_sursa": "",
    "variante": {
      "a": "Stochează instrucțiunile programului",
      "b": "Decodifică instrucțiunile programului",
      "c": "Efectuează operații logice",
      "d": "Toate variantele enumerate"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 22",
    "imagine": ""
  },
  {
    "id": 169,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Care dintre următoarele unități de memorie comunică direct cu UCP?",
    "cod_sursa": "",
    "variante": {
      "a": "Memoria auxiliară",
      "b": "Memoria principală",
      "c": "Memoria secundară",
      "d": "Niciuna dintre variantele enumerate"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 23",
    "imagine": ""
  },
  {
    "id": 170,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "O magistrală a unui sistem de calcul constă din:",
    "cod_sursa": "",
    "variante": {
      "a": "Un set de linii paralele",
      "b": "Acumulatori",
      "c": "Registre",
      "d": "Niciuna dintre variantele enumerate"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 24",
    "imagine": ""
  },
  {
    "id": 171,
    "materie": "Sisteme de calcul",
    "subcategorie": "Arhitectura calculatoarelor",
    "enunt": "Reprezentarea în virgulă mobilă, simplă precizie, a numărului zecimal−12,25este:",
    "cod_sursa": "",
    "variante": {
      "a": "1 10000010 10001000000000000000000",
      "b": "1 01111100 10001000000000000000000",
      "c": "0"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Arhitectura calculatoarelor, Pb. 25",
    "imagine": ""
  },
  {
    "id": 172,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Care dintre următoarele mecanisme pot fi folosite pentru o implementare corectă a problemei\nsecțiunii critice fără utilizarea asteptării active?",
    "cod_sursa": "",
    "variante": {
      "a": "semafoare",
      "b": "algoritmul lui Dekker",
      "c": "algoritmul lui Peterson",
      "d": "mecanismul TSL",
      "e": "monitoare"
    },
    "raspuns_corect": [
      "a",
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 1",
    "imagine": ""
  },
  {
    "id": 173,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră 5 segmente de memorie (A, B, C, D, E) cu mărimile 2k, 6k, 4k, 3k, 4k și o memorie\ntotală de 16k. În memorie se încarcă în ordine segmentele A, B, C, D. Care dintre aceste segmente\nurmează să fie evacuat pentru a putea permite încărcarea ulterioară a segmentuluiE?",
    "cod_sursa": "",
    "variante": {
      "a": "A",
      "b": "B",
      "c": "C",
      "d": "D",
      "e": "niciunul"
    },
    "raspuns_corect": [
      "b",
      "c",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 2",
    "imagine": ""
  },
  {
    "id": 174,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Care dintre problemele clasice de comunicare între procese pune în evidență o situație de impas?",
    "cod_sursa": "",
    "variante": {
      "a": "Problema filosofilor la masă",
      "b": "Problema cititorilor și scriitorilor",
      "c": "Problema producător-consumator",
      "d": "Problema frizerului",
      "e": "niciuna dintre aceste probleme"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 3",
    "imagine": ""
  },
  {
    "id": 175,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un set de 10 procese planificate conform algoritmului Round Robin. Se cunosc\nurmătoarele informații: cuanta utilizată este 8, numărul final de comutări de context este 25,\nvaloarea raportuluiT 1/T2 = 2.25, undeT 1 șiT 2 sunt timpii estimați de execuție pentru cel mai\nlung si cel mai scurt proceș pentru care timpul estimat de execuție depășește valoarea cuantei\n(cu cel putin 25%). Determinați cea mai mică valoare posibilă pentru perechea (T1, T2).",
    "cod_sursa": "",
    "variante": {
      "a": "27, 12",
      "b": "31, 14",
      "c": "34, 15",
      "d": "36,"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 4",
    "imagine": ""
  },
  {
    "id": 176,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un set de 10 procese planificate conform algoritmului SJF, în care procesele sosesc\nîn sistem la momentele T1 = 0, T2 = 13, T3 = 26. La fiecare moment sosesc cel puțin 3 procese, cu\ntimpi estimați de execuție diferiți. Dacă pentru proceseleP1, P5 șiP 7 avem timpii de așteptare\n0,0,0și timpii de răspuns 14,3,6, identificați la ce moment a sosit procesulP1, apoi răspundeți la\nurmătoarea întrebare: determinați timpii estimați de execuție pentru cel puțin 6 procese, știind\ncă nu există perioade de pauză ale procesorului și că pot exista procese cu același timp estimat\nde execuție, sosite la momente diferite?",
    "cod_sursa": "",
    "variante": {
      "a": "3,4,5,6,7,8",
      "b": "3,4,5,6,6,8",
      "c": "3,4,5,6,7,14",
      "d": "3,4,6,6,7,14"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 5",
    "imagine": ""
  },
  {
    "id": 177,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Un sistem pe 16 biți cu 8 pagini virtuale și 4 pagini cadru este folosit pentru paginare algoritmul\nFIFO. La un moment dat în memorie sunt mapate paginile (2, 5, 7, 1). După acest moment vor fi\naccesate următoarele adrese:12411,16729,2560,9215,20952. Care va fi maparea paginilor după\nultima accesare, știind că următoarea pagină evacuată este prima pagină cadru?",
    "cod_sursa": "",
    "variante": {
      "a": "5 2 0 4",
      "b": "3 4 2 5",
      "c": "2 5 0 3",
      "d": "5"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 6",
    "imagine": ""
  },
  {
    "id": 178,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Un sistem pe 16 biți cu 8 pagini virtuale și 4 pagini cadru este folosit pentru paginare algoritmul\nCeasului, fără îmbătrânire. La un moment dat în memorie sunt mapate paginile (2, 5, 7, 1) iar\nurmătoarea pagină testată va fi prima pagină cadru. După încercările de acces către paginile,\n1,2,3,4,5,7(nu neaparat în această ordine) maparea devine (1, 5, 7, 2). Care dintre cele 4 pagini\ninițiale au avut bitul R setat?",
    "cod_sursa": "",
    "variante": {
      "a": "toate",
      "b": "niciuna",
      "c": "paginile 5 s ,i 7",
      "d": "paginile 2, 5 s ,i"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 7",
    "imagine": ""
  },
  {
    "id": 179,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră 3 fire de control a execuției care partajează variabilele A și B. Accesul către cele\ndouă variabile este nerestricționat iar operațiile realizate sunt în fiecare fir de control a execuției,\nurmătoareleA=A+B, B=A−B, A=A−B. Precizați care dintre următoarele valori sunt\nposibile la sfârșitul execuției celor trei fire de control, atunci cândA= 5, B= 7",
    "cod_sursa": "",
    "variante": {
      "a": "A= 5, B= 7",
      "b": "A= 7, B= 5",
      "c": "A=−29, B= 17",
      "d": "A=−31, B="
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 8",
    "imagine": ""
  },
  {
    "id": 180,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră o situație simplă cu 6 procese și un singur tip de resurse. Starea sistemului este\ndescrisă prin Alocare = (4,2,0,5,1,4), M ax= (8,10,10,25,25,30), Disponibil=D. Determinați\nvaloarea minimă D pentru care starea este sigură și permite apoi alocarea a 3 resurse suplimentare\ncătre procesul al doilea.",
    "cod_sursa": "",
    "variante": {
      "a": "D= 12",
      "b": "D= 14",
      "c": "D= 13",
      "d": "D="
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 9",
    "imagine": ""
  },
  {
    "id": 181,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră o situație simplă cu 6 procese și un singur tip de resurse. Starea sistemului este\ndescrisă prin Alocare = (4,2,0,5,1,4), M ax= (14,6,8,29,27,24), Disponibil=D. Determinați\nvaloarea minimă D pentru care starea este sigură și permite apoi alocarea a 3 resurse suplimentare\ncătre procesul al treilea.",
    "cod_sursa": "",
    "variante": {
      "a": "D= 11",
      "b": "D= 13",
      "c": "D= 14",
      "d": "D="
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 10",
    "imagine": ""
  },
  {
    "id": 182,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Care dintre următoarele operații reprezintă operații atomice permise asupra semafoarelor?",
    "cod_sursa": "",
    "variante": {
      "a": "wait",
      "b": "up",
      "c": "sleep",
      "d": "down",
      "e": "niciuna dintre acestea"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 11",
    "imagine": ""
  },
  {
    "id": 183,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "O instrucțiune TSL ar trebui să fie executată?",
    "cod_sursa": "",
    "variante": {
      "a": "după fiecare proces în parte",
      "b": "periodic",
      "c": "într-o manieră atomică",
      "d": "în niciuna dintre situațiile precizate"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 12",
    "imagine": ""
  },
  {
    "id": 184,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "O unitate de execuție care nu poate fi intreruptă este",
    "cod_sursa": "",
    "variante": {
      "a": "simplă",
      "b": "statică",
      "c": "atomică",
      "d": "dinamică",
      "e": "niciuna dintre acestea"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 13",
    "imagine": ""
  },
  {
    "id": 185,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Precizați principalele dezavantaje ale spinlock-urilor",
    "cod_sursa": "",
    "variante": {
      "a": "nu sunt eficiente pentru multe procese",
      "b": "implică tehnici de așteptare activă",
      "c": "pot fi nesigure ocazional",
      "d": "sunt prea complexe pentru programatori",
      "e": "niciuna dintre acestea"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 14",
    "imagine": ""
  },
  {
    "id": 186,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Fiecare dintre procesele P_i, cu i = 0, 1, ..., 9 este caracterizat prin următoarea secvență de cod. Într-un al 11-lea proces P_10, liniile up(mutex) și down(mutex) au fost inversate. Care este numărul maxim de procese care s-ar putea găsi simultan în regiunea critică în acest caz, știind că inițial este permisă trecerea prin mutex?",
    "cod_sursa": "repeat\n  down(mutex)\n  {Critical Section}\n  up(mutex)\nforever",
    "variante": {
      "a": "1",
      "b": "2",
      "c": "3",
      "d": "Oricare dintre variantele a), b), c)",
      "e": "Niciuna dintre variantele a), b), c)"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 15",
    "imagine": ""
  },
  {
    "id": 187,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Într-un sistem se găsesc trei procese concurente, care conțin următoarele bucăți de cod, sincronizate prin trei semafoare binare. Semafoarele sunt inițializate cu valorile S_0 = 1, S_1 = 0 și S_2 = 0. De câte ori va executa primul proces linia print '0'?",
    "cod_sursa": "Process P0\nwhile(true)\n{\n  down(S0);\n  print '0';\n  up(S1);\n  up(S2);\n}\n\nProcess P1\ndown(S1);\nup(S0);\n\nProcess P2\ndown(S2);\nup(S0);",
    "variante": {
      "a": "Cel puțin de două ori",
      "b": "Exact de două ori",
      "c": "Exact de trei ori",
      "d": "Cel mult de trei ori",
      "e": "Exact o dată"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 16",
    "imagine": ""
  },
  {
    "id": 188,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un set de patru procese, cu timpi estimați de execuție 2, 3, 4 și 5. Fiecare dintre\nprocese are două execuții succesive separate printr-un ciclu de operații de intrare/ieșire. Planificarea proceselor este FIFO. Știind că timpii de răspuns după cea de-a doua execuție, raportați\nla momentul 0, sunt 30, 28, 20, 25, precizați care sunt duratele operațiilor de intrare/ieșire pentru\ndouă dintre aceste procese.",
    "cod_sursa": "",
    "variante": {
      "a": "7s ,i13",
      "b": "17s ,i14",
      "c": "5s ,i17",
      "d": "9s ,i15"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 17",
    "imagine": ""
  },
  {
    "id": 189,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un set de patru procese, cu timpi estimați de execuție 2, 3, 4 și 5. Fiecare dintre\nprocese are două execuții succesive separate printr-un ciclu de operații de intrare/ieșire. Planificarea inițială a proceselor este FIFO, după momentul 15, algoritmul de planificare este modificat\n\nla SJF. Știind că timpii de răspuns după cea de-a doua execuție, raportați la momentul 0, sunt\n22, 25, 20, 30, și că timpii asociați operațiilor de intrare/ieșire sunt 3, 7, 13, 17, precizați care dintre\nprocese nu pot avea operații de intrare/ieșire de durată 13.",
    "cod_sursa": "",
    "variante": {
      "a": "1s ,i3",
      "b": "2s ,i3",
      "c": "1s ,i2",
      "d": "3s ,i4"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 18",
    "imagine": ""
  },
  {
    "id": 190,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un set de patru procese, cu timpi estimați de execuție 2, 3, 4 și 5. Fiecare dintre\nprocese are două execuții succesive separate printr-un ciclu de operații de intrare/ieșire. Planificarea proceselor este SJF. Știind că timpii de răspuns după cea de-a doua execuție, raportați la\nmomentul 0, sunt 22, 25, 20, 30, precizați, în ordine crescătoare, care pot fi duratele operațiilor de\nintrare/ieșire pentru procesele 3 și 4, știind că procesul 4 a revenit în sistem înaintea procesului\n2.",
    "cod_sursa": "",
    "variante": {
      "a": "3s ,i13",
      "b": "7s ,i11",
      "c": "3s ,i7",
      "d": "3s ,i11"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 19",
    "imagine": ""
  },
  {
    "id": 191,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Într-un sistem sunt definite patru pagini cadru și opt pagini virtuale. La un moment dat în\ntimpul utilizării unui algoritm de paginare, după înlocuirea unei pagini din memorie cu pagina\n3, maparea în memorie este 3,6,4,2. Știind că bitul R este setat și pentru a treia pagină cadru,\nestimați maparea paginilor în memorie după încercări de acces către paginile 3,7,2,1,3,5,0(cu\nmențiunea că primul moment este cel din enunț), folosind algoritmul FIFO.",
    "cod_sursa": "",
    "variante": {
      "a": "0, 7, 5, 1",
      "b": "0, 7, 1, 5",
      "c": "5, 1, 7, 0",
      "d": "3, 6, 4, 2",
      "e": "2, 4, 6,"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 20",
    "imagine": ""
  },
  {
    "id": 192,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Într-un sistem sunt definite patru pagini cadru și opt pagini virtuale. La un moment dat în\ntimpul utilizării unui algoritm de paginare, după înlocuirea unei pagini din memorie cu pagina\n3, maparea în memorie este 3,6,4,2. Știind că bitul R este setat și pentru a treia pagină cadru,\nestimați maparea paginilor în memorie după încercări de acces către paginile 3,7,2,1,3,5,0(cu\nmențiunea că primul moment este cel din enunț), folosind algoritmul ‘a doua șansă’ (SC).",
    "cod_sursa": "",
    "variante": {
      "a": "3, 0, 1, 2",
      "b": "2, 1, 0, 3",
      "c": "3, 6, 4, 2",
      "d": "3, 1, 0, 2",
      "e": "3, 0, 1,"
    },
    "raspuns_corect": [
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 21",
    "imagine": ""
  },
  {
    "id": 193,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Într-un sistem sunt definite patru pagini cadru și opt pagini virtuale. La un moment dat în timpul\nutilizării unui algoritm de paginare, după înlocuirea unei pagini din memorie cu pagina 3, maparea\nîn memorie este 3,6,4,2. S ,tiind că bitul R este setat și pentru a treia pagină cadru, estimați\nmaparea paginilor în memorie după încercări de acces către paginile 3,7,2,1,3,5,0(cu mențiunea\ncă primul moment este cel din enunț), folosind algoritmul OPTIM (după ultimul moment se\nconsideră că paginile vor fi accesate în ordine strict crescătoare, de la0la7).",
    "cod_sursa": "",
    "variante": {
      "a": "3, 1, 0, 2",
      "b": "3, 0, 1, 2",
      "c": "2, 1, 0, 3",
      "d": "3, 6, 4, 2",
      "e": "0, 1, 2,"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 22",
    "imagine": ""
  },
  {
    "id": 194,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Un calculator are 6 GB de RAM, din care sistemul de operare ocupă 1 GB. Procesele au toate 512\nMB și au aceleași caracteristici. Dacă obiectivul este o utilizare a CPU de 98%, care este timpul\nmaxim de așteptare I/O tolerat?",
    "cod_sursa": "",
    "variante": {
      "a": "2%",
      "b": "85%",
      "c": "50%",
      "d": "67%"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 23",
    "imagine": ""
  },
  {
    "id": 195,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră un sistem cu 10 procese concurente. Fiecare proces petrece 60% din timpul său\nașteptând operații I/O. Care va fi procentul de utilizare al procesorului?",
    "cod_sursa": "",
    "variante": {
      "a": "∼100%",
      "b": "∼60%",
      "c": "∼40%",
      "d": "∼10%"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 24",
    "imagine": ""
  },
  {
    "id": 196,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Într-un sistem cu fire de execuție, există câte o stivă pe fir sau o stivă pe proces atunci când sunt\nutilizate fire de execuție la nivel de utilizator și fire de execuție la nivel de kernel?",
    "cod_sursa": "",
    "variante": {
      "a": "o stivă pe fir pentru ambele cazuri",
      "b": "o stivă pe fir pentru firele de execuție la nivel de utilizator, în timp ce firele de execuție la\nnivel de kernel folosesc o stivă pe proces",
      "c": "o stivă pe fir pentru firele de execuție la nivel de kernel, în timp ce firele de execuție la nivel\nde utilizator folosesc o stivă pe proces",
      "d": "o stivă pe proces pentru ambele cazuri"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 25",
    "imagine": ""
  },
  {
    "id": 197,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Să considerăm o linie de asamblare de fabricație în care diferiți muncitori efectuează diferite sarcini pentru a asambla un produs:\n\n(1) Furnizorii de componente, care furnizează componentele necesare pentru procesul de asamblare;\n(2) Asamblorii, care primesc componentele și le asamblează în produsul final;\n(3) Inspectorii, care verifică calitatea produselor finite pentru a se asigura că îndeplinesc standardele cerute;\n(4) Ambalatorii, care primesc produsele inspectate și le ambalează pentru expediere sau distribuție;\n(5) Transportatorii, care primesc produsele ambalate și le pregătesc pentru transport către clienți sau comercianți.\n\nPrin relaționarea acestui model cu procesele din UNIX, ce formă de comunicare între procese descrie cel mai bine această interacțiune?",
    "cod_sursa": "",
    "variante": {
      "a": "funcțiile fork pentru a crea procese",
      "b": "semnale",
      "c": "pipe-uri",
      "d": "fire de execuție"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 26",
    "imagine": ""
  },
  {
    "id": 198,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Se consideră următorul cod C; câte procese copil sunt create la executarea acestui program?",
    "cod_sursa": "void main() {\nfork();\nfork();\nexit();\nfork();\n}",
    "variante": {
      "a": "2",
      "b": "3",
      "c": "4",
      "d": "8"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 27",
    "imagine": ""
  },
  {
    "id": 199,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Pentru adresa virtuală zecimală 20202, calculați numărul paginii virtuale și offset-ul, știind că\ndimensiunea unei pagini este 4 KB:",
    "cod_sursa": "",
    "variante": {
      "a": "16, 3818",
      "b": "4, 3818",
      "c": "5, 202",
      "d": "20,"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 28",
    "imagine": ""
  },
  {
    "id": 200,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Aplicația de mai jos citește dintr-un fișier ce conține doar șirul de caractere \"licență\". Care va fi\nmesajul afișat pe ecran dacă citirea este reușită:",
    "cod_sursa": "#define SIZE 4\nwhile((n = read(fd, buffer, SIZE)) > 0)\n{\nprintf(\"%s\\n\",buffer);\n}",
    "variante": {
      "a": "licență",
      "b": "lice",
      "c": "lice\nnță",
      "d": "lice\nnțăe"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 29",
    "imagine": ""
  },
  {
    "id": 201,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Următorul fragment de cod ar trebui să folosească pipe-uri pentru a comunica între procesul copil și procesul părinte. Este ceva în neregulă cu mecanismul de pipe-uri din fragmentul de cod de mai jos?",
    "cod_sursa": "int pipe_fd[2];\nchar buffer[512];\npid_t pid=fork();\nif(pid<0){\n    perror(\"error\");\n    exit(1);\n}\nif(pid==0){\n    write(pipe_fd[1],buffer,sizeof(buffer));\n} else{\n    close(pipe_fd[0]);\n    read(pipe_fd[0],buffer,sizeof(buffer));\n    close(pipe_fd[1]);\n    printf(\"%s\\n\",buffer);\n    wait(NULL);\n}",
    "variante": {
      "a": "pipe-ul nu este deschis",
      "b": "capetele pipe-ului nu sunt închise în procesul copil",
      "c": "capetele pipe-ului sunt corect închise în procesul părinte",
      "d": "capetele pipe-ului sunt închise incorect în procesul părinte"
    },
    "raspuns_corect": [
      "a",
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 30",
    "imagine": ""
  },
  {
    "id": 202,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Care dintre următoarele este o funcție a unui sistem de operare?",
    "cod_sursa": "",
    "variante": {
      "a": "Managementul memoriei",
      "b": "Protecția antivirus",
      "c": "Managementul fișierelor",
      "d": "Managementul bazelor de date"
    },
    "raspuns_corect": [
      "a",
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 31",
    "imagine": ""
  },
  {
    "id": 203,
    "materie": "Sisteme de calcul",
    "subcategorie": "Sisteme de operare",
    "enunt": "Un grup de proiectanți de sisteme de operare ia în considerare modalități de reducere a dimensiunii\nmemoriei necesare în noul lor sistem de operare. Liderul echipei a sugerat să nu se deranjeze să\nsalveze secțiunea de text a programului în zona de swap, ci pur și simplu să-l pagineze direct din\nfișierul binar ori de câte ori este necesar. În ce condiții, funcționează această idee pentru textul\nprogramului?",
    "cod_sursa": "",
    "variante": {
      "a": "funcționează pentru program dacă programul nu poate fi modificat",
      "b": "funcționează pentru date, dacă datele nu pot fi modificate",
      "c": "funcționează dacă datele sunt modificate și programul nu",
      "d": "funcționează dacă programul este modificat și datele nu sunt modificate\nReț ele de calculatoare"
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Sisteme de operare, Pb. 32",
    "imagine": ""
  },
  {
    "id": 204,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Intr-un segment TCP ce câmp permite nodului receptor să determine dacă un segment TCP a\nfost deteriorat în timpul transmisiei?",
    "cod_sursa": "",
    "variante": {
      "a": "suma de control;",
      "b": "flags;",
      "c": "hash;",
      "d": "padding;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 1",
    "imagine": ""
  },
  {
    "id": 205,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care dintre următoarele dispozitive se află la nivelul 2 OSI?",
    "cod_sursa": "",
    "variante": {
      "a": "bridge(punte);",
      "b": "repeater(repetor);",
      "c": "router;",
      "d": "switch;",
      "e": "hub;"
    },
    "raspuns_corect": [
      "a",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 2",
    "imagine": ""
  },
  {
    "id": 206,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Pentru a asigura integritatea datelor, protocoalele orientate pe conexiune (ca TCP) folosesc:",
    "cod_sursa": "",
    "variante": {
      "a": "semnătura digitala;",
      "b": "certificate digitale;",
      "c": "algoritmi de criptare simetrici;",
      "d": "suma de control (checksum);"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 3",
    "imagine": ""
  },
  {
    "id": 207,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Ordinea corectă a încapsulării mesajelor este:",
    "cod_sursa": "",
    "variante": {
      "a": "date, cadre, pachete, segmente, biți;",
      "b": "segmente, date, pachete, cadre, biți;",
      "c": "date, segmente, pachete, cadre, biți;",
      "d": "date, segmente, cadre, pachete, biți;"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 4",
    "imagine": ""
  },
  {
    "id": 208,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Ce afirmații sunt adevărate despre protocolul TCP?",
    "cod_sursa": "",
    "variante": {
      "a": "este un protocol orientat de datagrame;",
      "b": "este un protocol orientat pe conexiune;",
      "c": "nu folosește sume de control;",
      "d": "asigură segmentare și reasamblare;"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 5",
    "imagine": ""
  },
  {
    "id": 209,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care din următoarele adrese IP se încadrează în blocul CIDR din 115.64.4.0/22? (Alegeti două.)",
    "cod_sursa": "",
    "variante": {
      "a": "115.64.8.32;",
      "b": "115.64.6.255;",
      "c": "115.64.8.31;",
      "d": "115.64.5.128;"
    },
    "raspuns_corect": [
      "b",
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 6",
    "imagine": ""
  },
  {
    "id": 210,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Ce informații sunt conținute de headerul unui frame Ethernet?",
    "cod_sursa": "",
    "variante": {
      "a": "sursa și destinația adresei de hardware;",
      "b": "sursa și destinația adresei de rețea;",
      "c": "codul de corectare a erorilor;",
      "d": "codul de autentificare;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 7",
    "imagine": ""
  },
  {
    "id": 211,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care din următoarele afirmații sunt adevărate referitor la switch?",
    "cod_sursa": "",
    "variante": {
      "a": "crează un singur domeniu de coliziune și un singur domeniu de broadcast ;",
      "b": "crează diferite domenii de coleziune dar un singur domeniu de ibroadcast;",
      "c": "crează diferite domenii de coleziune și diferite domenii de broadcast;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 8",
    "imagine": ""
  },
  {
    "id": 212,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care din următoarele adrese IP este un exemplu valid de adresă IPv4 ?",
    "cod_sursa": "",
    "variante": {
      "a": "144.92.254.253;",
      "b": "144-92-43-178;",
      "c": "144.92.256.176;",
      "d": "144,92,43,178;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 9",
    "imagine": ""
  },
  {
    "id": 213,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care este semnificția aconimului CSMA/CD?",
    "cod_sursa": "",
    "variante": {
      "a": "Carrier Service Multiple Access with Collision Detection;",
      "b": "Carrier Sense Multiple Access with Collision Avoidance;",
      "c": "Carrier Sense Multiple Access with Collision Detection;",
      "d": "Control Sense Multiple Access with Collision Direction;"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 10",
    "imagine": ""
  },
  {
    "id": 214,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Cum se comportă un switch când primește un cadru pe o anumită interfață iar adresa destinație\nnu este cunoscută?",
    "cod_sursa": "",
    "variante": {
      "a": "interoghează serverul DNS;",
      "b": "trimite pachetul în întreaga rețea (broadcast);",
      "c": "ignoră pachetul;",
      "d": "interoghează nodul sursă;",
      "e": "trimite pachetul pe prima interfață de rețea disponibilă;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 11",
    "imagine": ""
  },
  {
    "id": 215,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Întârzierea de propagare se referă la:",
    "cod_sursa": "",
    "variante": {
      "a": "Timpul necesar pentru a \"pune\" pe sârmă un mesaj de o anumită dimensiune;",
      "b": "Numărul de biți aflați în propagare cu o anumită întârziere;",
      "c": "Numărul de octeți transmiși de o aplicație;",
      "d": "Timpul necesar biților pentru a parcurge un canal de transmitere de o anumită lungime;"
    },
    "raspuns_corect": [
      "d"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 12",
    "imagine": ""
  },
  {
    "id": 216,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Întârzierea de transmitere se referă la:",
    "cod_sursa": "",
    "variante": {
      "a": "timpul necesar pentru a pune pe canalul de transmisie un mesaj de dimensiune M;",
      "b": "viteza necesara biților pentru a se propaga peste canal de o anumită lungime;",
      "c": "timpul necesar biților de a parcurge dus-întors canalul de comunicare;",
      "d": "timpul suficient pentru a transmite un 8 de biți pe fir;",
      "e": "timpul necesar a transmite un grup de biți peste un fir de o anumita lungime;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 13",
    "imagine": ""
  },
  {
    "id": 217,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Presupunând ca distanța dintre Timișoara și Arad este de 47 de kilometrii și avem o rată de\ntransfer de 500Mbps, latența transmiterii unui mesaj de 1MB este de:",
    "cod_sursa": "",
    "variante": {
      "a": "16.0128milisecunde",
      "b": "0.546M b/s",
      "c": "16.235milisecunde",
      "d": "273.008secunde",
      "e": "8∗10 3 milisecunde"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 14",
    "imagine": ""
  },
  {
    "id": 218,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Doriți să folosiți full-duplex Ethernet în locul half-duplex. Care sunt avantajele pentru rețea?",
    "cod_sursa": "",
    "variante": {
      "a": "mai multe domenii de coliziune;",
      "b": "ar trebui să fie mai rapid;",
      "c": "elimină nevoia de switch-uri;",
      "d": "mai puține domenii de broadcast;"
    },
    "raspuns_corect": [
      "a",
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 15",
    "imagine": ""
  },
  {
    "id": 219,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Calculați BDP pentru o conexiune cu următoarele repere: R=1Gbps, Distanta=100km",
    "cod_sursa": "",
    "variante": {
      "a": "10∗2 2M b",
      "b": "50MB",
      "c": "0.5Mb",
      "d": "125b",
      "e": "10MB"
    },
    "raspuns_corect": [
      "c"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 16",
    "imagine": ""
  },
  {
    "id": 220,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Un ISP deține o rețea de 100Mbps și dorește să aloce fiecărui client 50Mbps din lățimea de bandă\ndisponibilă. Presupunem că fiecare client folosește 75% din lățimea de bandă, în medie de utilizare\nindependentă. Care este probabilitatea statistică ca toată lățimea de bandă să fie utilizată?",
    "cod_sursa": "",
    "variante": {
      "a": "81/256",
      "b": "16/128",
      "c": "27/16",
      "d": "1",
      "e": "9/16"
    },
    "raspuns_corect": [
      "e"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 17",
    "imagine": ""
  },
  {
    "id": 221,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Produsul Lățime de Bandă – Întârziere (BDP) măsoară:",
    "cod_sursa": "",
    "variante": {
      "a": "Cantitatea de date aflată în tranzit la un moment dat;",
      "b": "Dimensiunea maximă a unui mesaj transmis;",
      "c": "Cantitatea de date ce poate fi transmisă la un moment dat de un emițător;",
      "d": "Numărul de octeți recepționați după o anumită întârziere;",
      "e": "Viteza cu care sunt transmise datele la o anumită întârziere;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 18",
    "imagine": ""
  },
  {
    "id": 222,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Calculați BDP pentru o conexiune cu următoarele repere: R=500Mbps, Distanța=100km",
    "cod_sursa": "",
    "variante": {
      "a": "250Kb",
      "b": "10∗2 2M b",
      "c": "250KB",
      "d": "125b",
      "e": "0.5Mb"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 19",
    "imagine": ""
  },
  {
    "id": 223,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "În modelul OSI nivelul rețea se ocupă cu:",
    "cod_sursa": "",
    "variante": {
      "a": "Trimiterea de mesaje între două dispozitive",
      "b": "Trimiterea de mesaje peste mai multe legături",
      "c": "Codificarea semnalului folosind analiză Fourier",
      "d": "Crearea unei conexiuni între două aplicații",
      "e": "Încapsularea mesajelor primite de la nivelul legătură de date"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 20",
    "imagine": ""
  },
  {
    "id": 224,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care este topologia rețelei unde fiecare nod este legat de cele mai apropiate două noduri în așa\nfel ca toată rețeaua să formeze un cerc?",
    "cod_sursa": "",
    "variante": {
      "a": "magistrala;",
      "b": "inel;",
      "c": "magistrala-stea;",
      "d": "stea;",
      "e": "LAN;"
    },
    "raspuns_corect": [
      "b"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 21",
    "imagine": ""
  },
  {
    "id": 225,
    "materie": "Sisteme de calcul",
    "subcategorie": "Rețele de calculatoare",
    "enunt": "Care dintre afirmațiile de mai jos sunt adevărate ?",
    "cod_sursa": "",
    "variante": {
      "a": "Nivelul Fizic se preocupă cu transmiterea unui flux de biți peste un mediu de transmisie;",
      "b": "Nivelul Fizic se preocupă cu transmiterea fișierelor peste un mediu de transmisie;",
      "c": "Nivelul Fizic se preocupă cu segmentarea și compresia de octeți peste un mediu de transmisie;",
      "d": "Nivelul Fizic se preocupă cu codificarea semnalelor sub formă de octeți;",
      "e": "Nivelul Fizic se preocupă cu codificarea semnalului optic sub formă de impulsuri electrice\nbinare;"
    },
    "raspuns_corect": [
      "a"
    ],
    "explicatie": "",
    "referinta_sursa": "Tematica 3: Sisteme de calcul - Rețele de calculatoare, Pb. 22",
    "imagine": ""
  }
];;;;;;;;;;;;;;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Tabs Navigation
  const tabQuizBtn = document.getElementById("tab-quiz-btn");
  const tabStudyBtn = document.getElementById("tab-study-btn");
  const quizTabContent = document.getElementById("quiz-tab-content");
  const studyTabContent = document.getElementById("study-tab-content");

  tabQuizBtn.addEventListener("click", () => {
    tabQuizBtn.classList.add("active");
    tabStudyBtn.classList.remove("active");
    quizTabContent.classList.remove("hidden");
    studyTabContent.classList.add("hidden");
  });

  tabStudyBtn.addEventListener("click", () => {
    tabStudyBtn.classList.add("active");
    tabQuizBtn.classList.remove("active");
    studyTabContent.classList.remove("hidden");
    quizTabContent.classList.add("hidden");
    initStudyMode();
  });

  // Study Mode Filters
  const studySearchInput = document.getElementById("study-search-input");
  const studyCategorySelect = document.getElementById("study-category-select");

  studySearchInput.addEventListener("input", filterStudyQuestions);
  studyCategorySelect.addEventListener("change", filterStudyQuestions);
  // Attach Event Listeners
  startBtn.addEventListener("click", initQuiz);
  checkBtn.addEventListener("click", validateAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", showStartScreen);
  clearLeaderboardBtn.addEventListener("click", clearLeaderboard);
  
  copyCodeBtn.addEventListener("click", copyCode);

  // Load DeepSeek API Key from localStorage
  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem("deepseek_api_key") || "";
  }
  // Attach AI Explain click listener
  if (aiExplainBtn) {
    aiExplainBtn.addEventListener("click", getAIExplanation);
  }

  // Bind resume session button listeners
  if (resumeBtn) {
    resumeBtn.addEventListener("click", resumeLearningSession);
  }
  if (discardSessionBtn) {
    discardSessionBtn.addEventListener("click", discardLearningSession);
  }

  // Bind theme selector listeners
  const themeBtns = document.querySelectorAll(".theme-btn");
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setAppTheme(btn.dataset.theme);
    });
  });
  // Load saved theme
  const savedTheme = localStorage.getItem("uvtQuizTheme") || "dark";
  const activeThemeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
  if (activeThemeBtn) {
    themeBtns.forEach(b => b.classList.remove("active"));
    activeThemeBtn.classList.add("active");
  }
  setAppTheme(savedTheme);

  // Bind shortcuts guide button listener
  const kbdBtn = document.querySelector(".keyboard-toggle-btn");
  if (kbdBtn) {
    kbdBtn.addEventListener("click", () => {
      alert("Scurtături de tastatură disponibile în timpul Quiz-ului:\n\n" +
            "• Tastele [1] până la [5] sau [A] până la [E] - Selectează opțiunea corespunzătoare\n" +
            "• Tasta [Enter] - Validează răspunsul (Verifică) sau trece la următoarea întrebare");
    });
  }
  window.addEventListener("keydown", handleKeyboardShortcuts);

  // Check for active session initially
  checkActiveSession();

  // Render stats dashboard initially
  renderStatsDashboard();

  // Load Leaderboard on startup
  renderLeaderboard();
});

// Start Screen / Init Quiz
function showStartScreen() {
  resultScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  renderLeaderboard();
  checkActiveSession(); // Update resume banner visibility
  renderStatsDashboard(); // Update statistics dashboard
}

async function initQuiz() {
  selectedCategory = categorySelect.value;
  gameMode = modeSelect.value; // Read chosen mode
  
  // Save API key
  if (apiKeyInput) {
    localStorage.setItem("deepseek_api_key", apiKeyInput.value.trim());
  }
  
  let quizData = [];
  
  try {
    // Attempt to load questions dynamically
    const response = await fetch("quizData.json");
    if (!response.ok) throw new Error("Nu s-a putut încărca JSON-ul.");
    quizData = await response.json();
  } catch (error) {
    console.warn("Se folosește setul local de întrebări (fallback):", error.message);
    quizData = fallbackQuizData;
  }
  
  // Filter questions based on chosen category
  if (selectedCategory === "all") {
    filteredQuestions = [...quizData];
  } else if (selectedCategory === "mistakes") {
    const mistakes = JSON.parse(localStorage.getItem("uvtQuizMistakes") || "[]");
    if (mistakes.length === 0) {
      alert("Nu ai nicio întrebare greșită în istoric! Felicitări!");
      return;
    }
    filteredQuestions = quizData.filter(q => mistakes.includes(q.id));
  } else {
    filteredQuestions = quizData.filter(q => q.materie === selectedCategory);
  }

  // Shuffle the filtered questions to make it dynamic
  shuffleArray(filteredQuestions);

  // If Quiz Mode, limit to a maximum of 30 questions
  if (gameMode === "quiz") {
    const limit = Math.min(30, filteredQuestions.length);
    filteredQuestions = filteredQuestions.slice(0, limit);
  }

  // Reset counters
  currentQuestionIndex = 0;
  score = 0;

  // Save initial Learning Session state (overwrites any old ones)
  if (gameMode === "invatare") {
    localStorage.setItem("uvtLearningSession", JSON.stringify({
      category: selectedCategory,
      questionIds: filteredQuestions.map(q => q.id),
      currentIndex: currentQuestionIndex,
      score: score
    }));
  }
  
  // Switch Screens
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  
  loadQuestion();
}

// Load Question
function loadQuestion() {
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  selectedChoices = [];
  isValidated = false;
  
  // Reset buttons
  checkBtn.classList.remove("hidden");
  checkBtn.disabled = true; // Disabled until at least one choice is selected
  nextBtn.classList.add("hidden");
  
  // Reset Explanation
  explanationBox.classList.add("hidden");
  explanationBox.className = "explanation-card hidden"; // reset border classes

  // Update Header Metas
  quizCategoryBadge.textContent = currentQuestion.subcategorie ? `${currentQuestion.materie} - ${currentQuestion.subcategorie}` : currentQuestion.materie;
  quizQuestionNumber.textContent = `Întrebarea ${currentQuestionIndex + 1}/${filteredQuestions.length}`;
  
  // Update Progress Bar
  const progressPercent = ((currentQuestionIndex) / filteredQuestions.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;

  // Update Question Content
  questionText.textContent = currentQuestion.enunt;

  // Diagram / Image Handler
  if (diagramContainer && diagramImg) {
    if (currentQuestion.imagine && currentQuestion.imagine.trim() !== "") {
      diagramImg.src = currentQuestion.imagine;
      diagramContainer.classList.remove("hidden");
    } else {
      diagramImg.src = "";
      diagramContainer.classList.add("hidden");
    }
  }



  // Code Block Handler
  if (currentQuestion.cod_sursa && currentQuestion.cod_sursa.trim() !== "") {
    codeText.textContent = currentQuestion.cod_sursa;
    codeBlockContainer.classList.remove("hidden");
  } else {
    codeBlockContainer.classList.add("hidden");
  }

  // Generate Choices
  choicesContainer.innerHTML = "";
  const varianteKeys = Object.keys(currentQuestion.variante); // e.g. ['a', 'b', 'c']
  
  varianteKeys.forEach(key => {
    const choiceTextVal = currentQuestion.variante[key];
    const isCode = isCodeString(choiceTextVal);
    const codeClass = isCode ? "code-choice" : "";
    
    // Create Button Element
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.dataset.key = key;
    
    // Build internal HTML structure for nice graphics
    button.innerHTML = `
      <span class="choice-prefix">${key}</span>
      <span class="choice-text ${codeClass}">${escapeHtml(choiceTextVal)}</span>
      <span class="choice-status-icon"><i class="fa-solid fa-circle-check"></i></span>
    `;
    
    // Add Click listener
    button.addEventListener("click", () => toggleChoiceSelection(button, key));
    choicesContainer.appendChild(button);
  });

  // Reset AI section
  if (aiExplainBtn) aiExplainBtn.classList.remove("hidden");
  if (aiExplanationLoading) aiExplanationLoading.classList.add("hidden");
  if (aiExplanationResult) {
    aiExplanationResult.classList.add("hidden");
    aiExplanationResult.innerHTML = "";
  }
}

// Choice Selection Toggle
function toggleChoiceSelection(buttonEl, key) {
  if (isValidated) return; // Ignore click if already validated
  
  const index = selectedChoices.indexOf(key);
  if (index > -1) {
    selectedChoices.splice(index, 1);
    buttonEl.classList.remove("selected");
  } else {
    selectedChoices.push(key);
    buttonEl.classList.add("selected");
  }

  // Enable check button if there is at least one answer selected
  checkBtn.disabled = selectedChoices.length === 0;
}



function validateAnswer() {
  if (isValidated) return;
  isValidated = true;
  
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const correctAnswers = currentQuestion.raspuns_corect; // array, e.g. ["b", "d"]
  
  // Mark choices graphically
  const choiceButtons = choicesContainer.querySelectorAll(".choice-btn");
  choiceButtons.forEach(button => {
    button.disabled = true; // disable future clicks
    const key = button.dataset.key;
    const isCorrectChoice = correctAnswers.includes(key);
    const isSelectedByUser = selectedChoices.includes(key);
    const iconEl = button.querySelector(".choice-status-icon i");

    if (isCorrectChoice) {
      if (isSelectedByUser) {
        button.classList.add("correct");
        iconEl.className = "fa-solid fa-circle-check";
      } else {
        // Correct choice that user missed
        button.classList.add("missed");
        iconEl.className = "fa-regular fa-circle-check";
      }
    } else {
      if (isSelectedByUser) {
        // Wrong choice selected by user
        button.classList.add("incorrect");
        iconEl.className = "fa-solid fa-circle-xmark";
      }
    }
  });

  // Calculate strict scoring: user must select EXACTLY all correct answers and no wrong ones
  const isCorrect = selectedChoices.length === correctAnswers.length && 
                    selectedChoices.every(choice => correctAnswers.includes(choice));

  if (isCorrect) {
    score++;
    explanationTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> Răspuns Corect!`;
    explanationBox.classList.add("correct-feedback");
    
    // Save to Correct Questions Set
    let correctSet = new Set(JSON.parse(localStorage.getItem("uvtCorrectQuestions") || "[]"));
    correctSet.add(currentQuestion.id);
    localStorage.setItem("uvtCorrectQuestions", JSON.stringify(Array.from(correctSet)));

    // Remove from Mistakes list if correct
    let mistakes = JSON.parse(localStorage.getItem("uvtQuizMistakes") || "[]");
    const idx = mistakes.indexOf(currentQuestion.id);
    if (idx > -1) {
      mistakes.splice(idx, 1);
      localStorage.setItem("uvtQuizMistakes", JSON.stringify(mistakes));
    }
  } else {
    explanationTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Răspuns Incorect!`;
    explanationBox.classList.add("incorrect-feedback");

    // Add to Mistakes list if incorrect
    let mistakes = JSON.parse(localStorage.getItem("uvtQuizMistakes") || "[]");
    if (!mistakes.includes(currentQuestion.id)) {
      mistakes.push(currentQuestion.id);
      localStorage.setItem("uvtQuizMistakes", JSON.stringify(mistakes));
    }
  }

  // Populate Explanation Box
  explanationTextContent.textContent = currentQuestion.explicatie || "Nu există explicație disponibilă.";
  referenceText.textContent = currentQuestion.referinta_sursa || "Referință nespecificată.";
  explanationBox.classList.remove("hidden");

  // Show Next button and hide Check button
  checkBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");

  // Update Progress Bar fill completely if we are at the end, else partial
  const progressPercent = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
}

// Next Question
function nextQuestion() {
  currentQuestionIndex++;
  
  // Save Learning Session progress
  if (gameMode === "invatare") {
    localStorage.setItem("uvtLearningSession", JSON.stringify({
      category: selectedCategory,
      questionIds: filteredQuestions.map(q => q.id),
      currentIndex: currentQuestionIndex,
      score: score
    }));
  }
  
  if (currentQuestionIndex < filteredQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show Results
function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  // Calculate percentage
  const totalQuestions = filteredQuestions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  finalScore.textContent = `${score}/${totalQuestions}`;
  percentageScore.textContent = `${percentage}%`;

  if (gameMode === "invatare") {
    localStorage.removeItem("uvtLearningSession"); // Clear active learning session
    resultTitle.textContent = "Modul Învățare Finalizat!";
    resultUser.textContent = `Ai parcurs toate cele ${totalQuestions} întrebări ale materiei: ${selectedCategory === "all" ? "Toate" : selectedCategory}.`;
  } else {
    // Customize feedback title
    if (percentage === 100) {
      resultTitle.textContent = "Excelent! Perfect!";
    } else if (percentage >= 80) {
      resultTitle.textContent = "Foarte Bine!";
    } else if (percentage >= 50) {
      resultTitle.textContent = "Felicitări! Ai trecut!";
    } else {
      resultTitle.textContent = "Mai studiază!";
    }
    resultUser.textContent = `Ai finalizat testul pentru materia: ${selectedCategory === "all" ? "Toate" : selectedCategory}.`;

    // Save score to LocalStorage only for Quiz mode
    saveScore(selectedCategory, score, totalQuestions, percentage);
  }
  
  // Render Leaderboard table
  renderLeaderboard();
}

// Save attempt in localStorage
function saveScore(cat, score, total, percentage) {
  const newRecord = {
    date: new Date().toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    category: cat === "all" ? "Toate" : cat,
    scoreText: `${score}/${total}`,
    percentage: `${percentage}%`,
    rawPercentage: percentage
  };

  let leaderboard = JSON.parse(localStorage.getItem("uvtQuizLeaderboard")) || [];
  leaderboard.push(newRecord);
  
  // Keep only the last 30 entries
  leaderboard.sort((a, b) => b.rawPercentage - a.rawPercentage); // Highest score first
  if (leaderboard.length > 30) leaderboard.splice(30);

  localStorage.setItem("uvtQuizLeaderboard", JSON.stringify(leaderboard));
}

// Render Leaderboard Table
function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("uvtQuizLeaderboard")) || [];
  leaderboardBody.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); font-style: italic;">
          Nu există scoruri salvate. Fii primul care completează testul!
        </td>
      </tr>
    `;
    return;
  }

  leaderboard.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.date}</td>
      <td><span class="badge" style="font-size: 0.7rem; padding: 4px 8px;">${record.category}</span></td>
      <td>${record.scoreText}</td>
      <td><strong style="color: ${record.rawPercentage >= 50 ? "var(--success)" : "var(--error)"}">${record.percentage}</strong></td>
    `;
    leaderboardBody.appendChild(row);
  });
}

// Clear Leaderboard
function clearLeaderboard() {
  if (confirm("Sigur vrei să ștergi tot istoricul scorurilor?")) {
    localStorage.removeItem("uvtQuizLeaderboard");
    renderLeaderboard();
  }
}

// Copy Code Helper
function copyCode() {
  const textToCopy = codeText.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    copyCodeBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success)"></i>';
    setTimeout(() => {
      copyCodeBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 2000);
  }).catch(err => {
    console.error("Eroare la copiere: ", err);
  });
}

// Shuffle Helper
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Escape HTML utility to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Helper to check if a string contains programming code structures
function isCodeString(str) {
  if (!str) return false;
  const patterns = [
    /\b(class|new|extends|implements|private|public|void|Thread|String|import|int|char|float|double|null)\b/,
    /\(\s*\)/,
    /\[\s*\]/,
    /\{\s*\}/,
    /[a-zA-Z0-9_]+\s*\([^)]*\)/,
    /->|::|=|\+=/,
    /;$/,
    /^[A-Z][a-zA-Z0-9_]*\([a-zA-Z0-9_, ]*\)$/
  ];
  return patterns.some(pattern => pattern.test(str));
}


// STUDY MODE LOGIC
let studyQuestions = [];

async function initStudyMode() {
  try {
    const response = await fetch("quizData.json");
    if (!response.ok) throw new Error("Could not fetch");
    studyQuestions = await response.json();
  } catch (error) {
    studyQuestions = [...fallbackQuizData];
  }
  filterStudyQuestions();
}

function filterStudyQuestions() {
  const searchText = document.getElementById("study-search-input").value.toLowerCase();
  const selectedCat = document.getElementById("study-category-select").value;

  const filtered = studyQuestions.filter(q => {
    // Category filter
    const matchesCat = (selectedCat === "all" || q.materie === selectedCat);
    
    // Text search filter
    const inEnunt = q.enunt.toLowerCase().includes(searchText);
    const inExplicatie = q.explicatie.toLowerCase().includes(searchText);
    const inVariante = Object.values(q.variante).some(v => v.toLowerCase().includes(searchText));
    const matchesText = (searchText === "" || inEnunt || inExplicatie || inVariante);

    return matchesCat && matchesText;
  });

  renderStudyQuestions(filtered);
}

function renderStudyQuestions(questions) {
  const listContainer = document.getElementById("study-questions-list");
  listContainer.innerHTML = "";

  if (questions.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">
        <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 10px; display: block; color: var(--secondary)"></i>
        Nu s-au găsit întrebări care să corespundă criteriilor de căutare.
      </div>
    `;
    return;
  }

  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "study-q-card";
    
    // Generate options HTML list
    let choicesHtml = "";
    Object.keys(q.variante).forEach(key => {
      const isCorrectChoice = q.raspuns_corect.includes(key);
      const correctClass = isCorrectChoice ? "correct" : "";
      const isCode = isCodeString(q.variante[key]);
      const codeClass = isCode ? "code-choice" : "";
      choicesHtml += `
        <div class="study-choice-item ${correctClass}">
          <span class="choice-prefix">${key}</span>
          <span class="choice-text ${codeClass}">${escapeHtml(q.variante[key])}</span>
        </div>
      `;
    });

    // Check if question has diagram image
    let diagramHtml = "";
    if (q.imagine && q.imagine.trim() !== "") {
      diagramHtml = `
        <div style="margin-top: 15px; margin-bottom: 15px; text-align: center; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 10px; overflow: hidden;">
          <img src="${q.imagine}" alt="Diagramă" style="max-width: 100%; max-height: 250px; height: auto; border-radius: 6px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1));" />
        </div>
      `;
    }

    // Check if question has code source
    let codeHtml = "";
    if (q.cod_sursa && q.cod_sursa.trim() !== "") {
      codeHtml = `
        <div class="code-block-container-study" style="margin: 15px 0 10px 0;">
          <div class="code-header">
            <span class="code-lang">Python</span>
          </div>
          <pre><code>${escapeHtml(q.cod_sursa)}</code></pre>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="study-q-header">
        <div class="study-q-title-wrapper">
          <div class="study-q-meta">
            <span class="study-q-id">ÎNTREBAREA #${q.id}</span>
            <span class="badge" style="font-size: 0.65rem; padding: 2px 6px;">${q.subcategorie ? `${q.materie} (${q.subcategorie})` : q.materie}</span>
          </div>
          <span class="study-q-text">${escapeHtml(q.enunt)}</span>
        </div>
        <i class="fa-solid fa-chevron-down study-q-arrow"></i>
      </div>
      <div class="study-q-body">
        <div class="study-q-content">
          ${diagramHtml}
          ${codeHtml}
          <div class="study-q-choices">
            ${choicesHtml}
          </div>
          <div class="explanation-card correct-feedback" style="background: rgba(0, 230, 118, 0.02); margin-top: 15px; margin-bottom: 0;">
            <div class="explanation-header" style="color: var(--success); font-size: 0.95rem;">
              <i class="fa-solid fa-circle-info"></i> Răspuns corect: ${q.raspuns_corect.join(", ").toUpperCase()}
            </div>
            <div class="explanation-body" style="font-size: 0.88rem;">
              <p>${escapeHtml(q.explicatie)}</p>
              <div class="reference-badge" style="margin-top: 10px;">
                <i class="fa-solid fa-bookmark"></i>
                <span>${escapeHtml(q.referinta_sursa)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add collapse toggle handler
    const header = card.querySelector(".study-q-header");
    header.addEventListener("click", () => {
      card.classList.toggle("expanded");
    });

    listContainer.appendChild(card);
  });
}

// Check for incomplete Learning sessions
function checkActiveSession() {
  const session = JSON.parse(localStorage.getItem("uvtLearningSession"));
  if (session && session.category && session.questionIds && session.questionIds.length > 0) {
    resumeCategoryName.textContent = session.category === "all" ? "Toate" : session.category;
    resumeProgressText.textContent = `${session.currentIndex + 1}/${session.questionIds.length}`;
    resumeSessionContainer.classList.remove("hidden");
  } else {
    resumeSessionContainer.classList.add("hidden");
  }
}

// Discard learning session progress
function discardLearningSession() {
  if (confirm("Sigur vrei să ștergi progresul salvat la sesiunea de învățare anterioară?")) {
    localStorage.removeItem("uvtLearningSession");
    checkActiveSession();
  }
}

// Resume learning session
async function resumeLearningSession() {
  const session = JSON.parse(localStorage.getItem("uvtLearningSession"));
  if (!session) return;

  let quizData = [];
  try {
    const response = await fetch("quizData.json");
    if (!response.ok) throw new Error("Nu s-a putut încărca JSON-ul.");
    quizData = await response.json();
  } catch (error) {
    console.warn("Se folosește setul local de întrebări (fallback):", error.message);
    quizData = fallbackQuizData;
  }

  // Reconstruct filteredQuestions based on saved IDs
  filteredQuestions = session.questionIds
    .map(id => quizData.find(q => q.id === id))
    .filter(Boolean);

  if (filteredQuestions.length === 0) {
    alert("Întrebările din sesiunea salvată nu mai există în baza de date.");
    localStorage.removeItem("uvtLearningSession");
    checkActiveSession();
    return;
  }

  selectedCategory = session.category;
  gameMode = "invatare";
  currentQuestionIndex = session.currentIndex;
  score = session.score;

  // Switch Screens
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
}


// DeepSeek AI Explanations Integration
async function getAIExplanation() {
  const apiKey = localStorage.getItem("deepseek_api_key");
  if (!apiKey) {
    const userKey = prompt("Introdu cheia ta API DeepSeek (sk-...):");
    if (userKey && userKey.trim().startsWith("sk-")) {
      localStorage.setItem("deepseek_api_key", userKey.trim());
      if (apiKeyInput) apiKeyInput.value = userKey.trim();
    } else {
      return;
    }
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  
  // Show loading state
  aiExplainBtn.classList.add("hidden");
  aiExplanationLoading.classList.remove("hidden");
  aiExplanationResult.classList.add("hidden");

  // Construct prompt
  const promptText = `
Întrebare:
${currentQuestion.enunt}

Cod sursă (dacă există):
${currentQuestion.cod_sursa || "Nu există cod sursă."}

Variante de răspuns:
${Object.entries(currentQuestion.variante).map(([k, v]) => `(${k}) ${v}`).join("\n")}

Răspunsul corect stabilit de barem:
${currentQuestion.raspuns_corect.join(", ").toUpperCase()}

Opțiunile pe care le-am selectat eu:
${selectedChoices.join(", ").toUpperCase() || "Niciuna"}

Te rog să îmi explici într-un mod didactic și concis de ce răspunsul corect este cel din barem, cum se execută codul (dacă este cazul) și de ce opțiunile selectate de mine sunt greșite (dacă am greșit). Răspunde direct în limba română, folosește formatare Markdown și păstrează tonul unui asistent universitar pasionat.
  `.trim();

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("deepseek_api_key")}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Ești un asistent universitar expert în Informatică la Universitatea de Vest din Timișoara, specializat în explicarea grilelor pentru examenul de licență."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Eroare HTTP ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Render markdown text
    aiExplanationResult.innerHTML = formatAIText(aiText);
    aiExplanationResult.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert(`Eroare la generarea explicației: ${error.message}`);
    aiExplainBtn.classList.remove("hidden");
  } finally {
    aiExplanationLoading.classList.add("hidden");
  }
}

// Basic Markdown Formatter Utility
function formatAIText(text) {
  let html = escapeHtml(text);
  
  // Replace bold **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Replace italic *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Replace inline code `code` -> <code>code</code>
  html = html.replace(/`(.*?)`/g, "<code style='background: rgba(255, 255, 255, 0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace;'>$1</code>");
  
  // Replace code blocks ```code``` -> <pre><code>code</code></pre>
  html = html.replace(/```([\s\S]*?)```/g, "<pre style='background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 4px; font-family: monospace; overflow-x: auto; margin: 10px 0;'><code>$1</code></pre>");
  
  // Replace newlines -> <br>
  html = html.replace(/\n/g, "<br>");
  
  return html;
}

// App Theme Control
function setAppTheme(theme) {
  document.body.classList.remove("theme-light", "theme-sepia");
  if (theme === "light") {
    document.body.classList.add("theme-light");
  } else if (theme === "sepia") {
    document.body.classList.add("theme-sepia");
  }
  localStorage.setItem("uvtQuizTheme", theme);
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
  if (quizScreen.classList.contains("hidden")) return;
  if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

  const key = e.key.toLowerCase();
  const choiceButtons = choicesContainer.querySelectorAll(".choice-btn");
  let targetIndex = -1;

  if (key >= '1' && key <= '5') {
    targetIndex = parseInt(key) - 1;
  } else if (key >= 'a' && key <= 'e') {
    targetIndex = key.charCodeAt(0) - 97;
  }

  if (targetIndex >= 0 && targetIndex < choiceButtons.length) {
    e.preventDefault();
    const btn = choiceButtons[targetIndex];
    if (btn && !btn.disabled) {
      const choiceKey = btn.dataset.key;
      toggleChoiceSelection(btn, choiceKey);
    }
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (!checkBtn.classList.contains("hidden") && !checkBtn.disabled) {
      validateAnswer();
    } else if (!nextBtn.classList.contains("hidden") && !nextBtn.disabled) {
      nextQuestion();
    }
  }
}

// Render dynamic Statistics & Progress Dashboard
function renderStatsDashboard() {
  const statsList = document.getElementById("stats-list");
  if (!statsList) return;

  const correctIds = JSON.parse(localStorage.getItem("uvtCorrectQuestions") || "[]");
  const correctSet = new Set(correctIds);

  const categories = [
    "Algoritmi și structuri de date",
    "Teoria grafurilor și combinatorică",
    "Logică computațională",
    "Limbaje formale și teoria automatelor",
    "Limbaje de programare și inginerie software",
    "Sisteme de calcul"
  ];

  statsList.innerHTML = "";

  categories.forEach(cat => {
    const catQuestions = fallbackQuizData.filter(q => q.materie === cat);
    const total = catQuestions.length;
    const correctCount = catQuestions.filter(q => correctSet.has(q.id)).length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const itemHtml = `
      <div class="stats-item" style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-main);">
          <span>${cat}</span>
          <span style="font-weight: 700; color: var(--primary);">${correctCount}/${total} (${percent}%)</span>
        </div>
        <div class="stats-progress-bg">
          <div class="stats-progress-fill" style="width: ${percent}%; height: 100%; background: var(--primary-grad); border-radius: 3px; transition: width 0.5s ease-out;"></div>
        </div>
      </div>
    `;
    statsList.innerHTML += itemHtml;
  });
}


