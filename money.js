// Initialize Firebase
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
const fines = JSON.parse(localStorage.getItem('fines')) || {};

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
    const fineList = document.getElementById('fine-list');

    // 새로운 벌금 항목 추가
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}: ${amount}원</span><button onclick="removeFine(this, '${name}', ${amount})">삭제</button>`;
    fineList.appendChild(li);

    // fines 객체 업데이트
    if (!fines[name]) {
        fines[name] = 0;
    }
    fines[name] += amount;

    // 로컬 스토리지 업데이트
    localStorage.setItem('fines', JSON.stringify(fines));

    // 누적 벌금액 및 총 벌금액 업데이트
    updateTotalFines();
    updateTotal();
}

// 벌금 삭제 함수
function removeFine(button, name, amount) {
    const li = button.parentElement;
    li.remove();

    // fines 객체 업데이트
    fines[name] -= amount;
    if (fines[name] <= 0) {
        delete fines[name];
    }

    // 로컬 스토리지 업데이트
    localStorage.setItem('fines', JSON.stringify(fines));

    // 누적 벌금액 및 총 벌금액 업데이트
    updateTotalFines();
    updateTotal();
}

// 총 벌금액 업데이트 함수
function updateTotal() {
    const totalElement = document.getElementById('total');
    let totalAmount = 0;

    for (const name in fines) {
        totalAmount += fines[name];
    }
    totalElement.innerText = `총 벌금: ${totalAmount}원`;
}

// 누적 벌금액 업데이트 함수
function updateTotalFines() {
    const totalFinesList = document.getElementById('total-fines-list');
    totalFinesList.innerHTML = '';

    for (const name in fines) {
        const li = document.createElement('li');
        li.innerText = `${name}: ${fines[name]}원`;
        totalFinesList.appendChild(li);
    }
}

// 페이지 로드 시 저장된 데이터 불러오기
window.onload = function() {
    const storedFines = JSON.parse(localStorage.getItem('fines')) || {};

    for (const name in storedFines) {
        const amount = storedFines[name];
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}: ${amount}원</span><button onclick="removeFine(this, '${name}', ${amount})">삭제</button>`;
        document.getElementById('fine-list').appendChild(li);
    }

    // 누적 벌금액 및 총 벌금액 업데이트
    updateTotalFines();
    updateTotal();
};
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
