import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDmPQWX2HHlsAK1n9jMX-A6rPmaysPGJ6M",
    authDomain: "penalty-71aed.firebaseapp.com",
    databaseURL: "https://penalty-71aed-default-rtdb.firebaseio.com",
    projectId: "penalty-71aed",
    storageBucket: "penalty-71aed.appspot.com",
    messagingSenderId: "567970323945",
    appId: "1:567970323945:web:a3735c3137836c3d353f78",
    measurementId: "G-WC6QDNCH0P"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const finesRef = ref(database, 'fines');

// 이벤트 리스너 추가
document.getElementById('fine-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (name && amount) {
        addFine(name, amount);
        document.getElementById('name').value = '';
        document.getElementById('amount').value = '';
    }
});

// 벌금 추가 함수
function addFine(name, amount) {
    const userRef = ref(database, 'fines/' + name);
    get(userRef).then(snapshot => {
        const currentAmount = snapshot.val() || 0;
        set(userRef, currentAmount + amount);
    });
}

// 벌금 삭제 함수
function removeFine(name, amount) {
    const userRef = ref(database, 'fines/' + name);
    get(userRef).then(snapshot => {
        const currentAmount = snapshot.val() || 0;
        const newAmount = currentAmount - amount;
        if (newAmount > 0) {
            set(userRef, newAmount);
        } else {
            remove(userRef);
        }
    });
}

// 총 벌금액 업데이트 함수
function updateTotal(fines) {
    const totalElement = document.getElementById('total');
    let totalAmount = 0;

    for (const name in fines) {
        totalAmount += fines[name];
    }
    totalElement.innerText = `총 벌금: ${totalAmount}원`;
}

// 누적 벌금액 업데이트 함수
function updateTotalFines(fines) {
    const totalFinesList = document.getElementById('total-fines-list');
    totalFinesList.innerHTML = '';

    for (const name in fines) {
        const li = document.createElement('li');
        li.innerText = `${name}: ${fines[name]}원`;
        totalFinesList.appendChild(li);
    }
}

// UI 업데이트 함수
function updateUI(fines) {
    const fineList = document.getElementById('fine-list');
    fineList.innerHTML = '';

    for (const name in fines) {
        const amount = fines[name];
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}: ${amount}원</span><button onclick="removeFine('${name}', ${amount})">삭제</button>`;
        fineList.appendChild(li);
    }

    updateTotalFines(fines);
    updateTotal(fines);
}

// 실시간 데이터 업데이트 리스너
onValue(finesRef, snapshot => {
    const fines = snapshot.val() || {};
    updateUI(fines);
});

// 페이지 로드 시 저장된 데이터 불러오기
window.onload = function() {
    get(finesRef).then(snapshot => {
        const fines = snapshot.val() || {};
        updateUI(fines);
    });
};
