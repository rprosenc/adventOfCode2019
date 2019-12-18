let i_start = 278384;
let i_end = 824795;
let cnt = 0; 

for(i=i_start; i<=i_end; i++) { 
	a=(''+i).split(''); 
	if (i==a.sort().join('') && a.map((c,i,a) => a[i+1]==c).filter(b=>b).length>0) {
		cnt++;
	} 
}

console.log(cnt)
