const fines = JSON.parse(localStorage.getItem('fines')) || {};

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

function addFine(name, amount) {
    const fineList = document.getElementById('fine-list');

    const li = document.createElement('li');
    li.innerHTML = `<span>${name}: ${amount}원</span><button onclick="removeFine(this, '${name}', ${amount})">삭제</button>`;
    fineList.appendChild(li);

    if (!fines[name]) {
        fines[name] = 0;
    }
    fines[name] += amount;

    localStorage.setItem('fines', JSON.stringify(fines));

    updateTotalFines();
    updateTotal(amount);
}

function removeFine(button, name, amount) {
    const li = button.parentElement;
    li.remove();

    fines[name] -= amount;
    if (fines[name] <= 0) {
        delete fines[name];
    }

    localStorage.setItem('fines', JSON.stringify(fines));

    updateTotalFines();
    updateTotal(-amount);
}

function updateTotal(amount) {
    const totalElement = document.getElementById('total');
    const currentTotal = parseFloat(totalElement.innerText.replace(/[^0-9.-]+/g,""));
    const newTotal = currentTotal + amount;
    totalElement.innerText = `총 벌금: ${newTotal}원`;
}

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
    let totalAmount = 0;

    for (const name in storedFines) {
        const amount = storedFines[name];
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}: ${amount}원</span><button onclick="removeFine(this, '${name}', ${amount})">삭제</button>`;
        document.getElementById('fine-list').appendChild(li);
        totalAmount += amount;
    }

    updateTotalFines();
    document.getElementById('total').innerText = `총 벌금: ${totalAmount}원`;
};
