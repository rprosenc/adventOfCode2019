const i_start = 278384;
const i_end = 824795;

let cnt = 0; 

for(let i=i_start; i<=i_end; i++) { 
	a = (''+i).split('');
	// not incremental
	if (i!=a.sort().join('')) {
		continue;
	}

/*** regexp solution

	// found a digit that occures twice but not thrice
	// need not test 0,1 or 2
	for (let j=3; j<=9; j++) {
		if ((new RegExp(''+j+j).test(i)) && !(new RegExp(''+j+j+j)).test(i)) {
			cnt++;
			break;
		}
	}
*/

/*** stupid count digits solution **/
	for (let j=3; j<=9; j++) {
		if (a.filter(d => d==j).length == 2) {
			cnt++;
			break;
		}
	}
}

console.log(cnt)
