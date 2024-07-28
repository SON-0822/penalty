// fines 객체를 로컬 스토리지에서 불러오거나 초기화
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
