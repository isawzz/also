var Signal, osig = { s: false };
//4. promise
function test4() {
	window.onclick = interrupt;
	let myPromise = new Promise(function (myResolve, myReject) {
		// "Producing Code" (May take some time)
		setTimeout(() => osig.s = true, 1000)
		let x = superLengthyFunction(osig);
		myResolve(); // when successful
		myReject();  // when error
	});
	document.getElementById("demo").innerHTML = 'HALLO!';
	console.log('hallo'); //das passiert erst nachher weil gequeued wird!

	// "Consuming Code" (Must wait for a fulfilled Promise)
	myPromise.then(
		function (value) { console.log("OK!"); /* code if successful */ },
		function (error) { console.log("ERROR!"); /* code if some error */ }
	);
}
function message(m) { document.getElementById('message').innerHTML += m; }
function interrupt() {
	Signal = true;
	osig.s = true;
	document.getElementById("demo").innerHTML = 'CLICK!' + Signal;
}
function superLengthyFunction(osig) {
	if (Signal == true){
		console.log('returning!')
		return;
	}else{
		setTimeout(superLengthyFunction,100);
	}
}

function superLengthyFunction1(osig) {
	for (let i = 0; i < 10; i++) {
		if (Signal == true || osig.s == true) {
			setTimeout(() => message('interrupt!'), 100);
			return false;
		} else {
			setTimeout(() => message('.' + Signal));
		}
		for (let j = 0; j < 1000; j++) {
			console.log('.');
		}
	}
	return true;
}


//3. setInterval
function test3() { setInterval(myFunction3, 1000); }
function myFunction3() { let d = new Date(); document.getElementById("demo").innerHTML = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); }

//2. setTimeout: pass full function
function test2() { setTimeout(function () { myFunction2("I love You !!!"); }, 3000); }
function myFunction2(value) { document.getElementById("demo").innerHTML = value; }

//1. setTimeout
function test1() { setTimeout(myFunction1, 3000); }
function myFunction1() { document.getElementById("demo").innerHTML = "I love You !!"; }

//0. callback
function test0() { myCalculator(5, 5, myDisplayer); }
function myDisplayer(some) { document.getElementById("demo").innerHTML = some; }
function myCalculator(num1, num2, myCallback) { let sum = num1 + num2; myCallback(sum); }

