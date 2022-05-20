const matheight = document.getElementById('matrix-height'); /* height of the matrix entered by the user */
const matwidth = document.getElementById('matrix-width'); /* width of the matrix also entered by the user */
const motherofmatrix = document.getElementById('matrix-mother'); /* parent div element in which matrix is displayed */
const createMatrixButton = document.getElementById('create-matrix'); /* button used for creating the matrix */
const solutionButton = document.getElementById('find-solution'); /* Find the solution button */
const choosenMethod = document.getElementById('methods'); /* Dropdown menu for method selection */
const sonelement = document.getElementById('son'); /* Container for Array B's inputs */
const myboard = document.getElementById('board'); /* Textarea in which the answer will be displayed */
let mainMessage = ''; /* Just a string data used in Gauss Jordan method */


createMatrixButton.addEventListener('click', createMatrix);
solutionButton.addEventListener('click', makeInputsReady);

/* Function for creating the matrix with the width and height values entered by the user */
function createMatrix() {
    motherofmatrix.innerHTML = ''; /* Need to make sure that previous values are cleared for the parent div */
    sonelement.innerHTML = ''; /* Also parent element of matrix B */
    
    motherofmatrix.style.gridTemplateColumns = `repeat(${matwidth.value}, 1fr)`;
    motherofmatrix.style.gap = '0.5rem';

    for (let i = 0; i < matheight.value; i++) { /* Loop that many times as the height of matrix */
        for (let j = 0; j < matwidth.value; j++) { /* Loop as many times as the width of matrix */
            let inputelement = document.createElement('input'); /* Creating input element "width" many times */
            inputelement.type = 'number';
            inputelement.max = 9;
            inputelement.min = -9;
            inputelement.value = 0; /* Default value to 0 to avoid undefined value */
            inputelement.className = 'matrix-input'; /* Give a class name */
            inputelement.id = `row${i}-col${j}`;
            motherofmatrix.appendChild(inputelement);
        }

        let matrixbinput = document.createElement('input');
        matrixbinput.type = 'number';
        matrixbinput.style.marginBottom = '0.5rem';
        matrixbinput.value = 0;
        matrixbinput.className = 'matrixbinput';
        matrixbinput.id = `matb${i}`;
        sonelement.appendChild(matrixbinput);
    }
}

function makeInputsReady() {
    let matrixA = new Array(matheight);
    let matrixB = new Array(matheight);
    let matrixX = new Array(matheight);

    for (let x = 0; x < matheight.value; x++) {
        matrixA[x] = new Array(matwidth);
        for (let y = 0; y < matwidth.value; y++) {
            matrixA[x][y] = document.getElementById(`row${x}-col${y}`).value;
        }

        matrixB[x] = document.getElementById(`matb${x}`).value;
        matrixX[x] = 0;
    }

    /* Call corresponding solution method function */
    switch (choosenMethod.value) {
        case 'gauss-jordan':
            myboard.value += '==========================================================================\r\n';
            mainMessage = '';
            GaussJordan(matrixA, matrixB);
            myboard.value += mainMessage;
            break;
        case 'gauss-seidel':
            myboard.value += '==========================================================================\r\n';
            for(let h=0; h<25; h++){
                matrixX = GaussSeidel(matrixA, matrixB, matrixX);
            }
            break;
        case 'gauss-jacobi':
            myboard.value += '==========================================================================\r\n';
            for(let h=0; h<25; h++){
                matrixX = GaussJacobi(matrixA, matrixB, matrixX);
            }
            break;
    }
}

/* ========== Gauss Seidel --------------------------------> Completed! ===============*/
function GaussSeidel(matrixAnow, matrixBnow, matrixXnow) {
    
    for (let a = 0; a < matheight.value; a++) {
        let d = matrixBnow[a];
        for (let b = 0; b < matheight.value; b++) {
            if (a != b) {
                d -= matrixAnow[a][b] * matrixXnow[b];
            }
        }
        matrixXnow[a] = d/matrixAnow[a][a];
    }

    let textnow = '';
    matrixXnow.map((element)=>(textnow += element + ' | '));
    myboard.value += textnow + '\r\n';

    return matrixXnow;
}
/* =====================================================================================*/

/*========== Gauss Jacobi ------------------------------------> Completed! =============*/
function GaussJacobi(matrixAnow, matrixBnow, matrixXnow){
    let newX = matrixXnow;

    for(let i=0; i < matheight.value; i++){
        let d = matrixBnow[i];
        for(let j=0; j < matheight.value; j++){
            if(i != j){
                d -= matrixAnow[i][j] * newX[j];
            }
        }

        matrixXnow[i] = d / matrixAnow[i][i];
        matrixXnow[i] = parseFloat(matrixXnow[i].toFixed(10));
    }

    let textnow = '';
    matrixXnow.map((element)=>(textnow += element + ' | '));
    myboard.value += textnow + '\r\n';

    return matrixXnow;
}
/* ======================================================================================*/

/*========= Gauss Jordan -------------------------------------> Completed! ===========*/
function GaussJordan(matrixAnow, matrixBnow){
    //let M = 10;
    function PrintMatrix(a,n){
        for (let i = 0; i < n; i++){
            for (let j = 0; j <= n; j++)
                mainMessage += (' || ' + a[i][j] + ' || ');
            mainMessage += '\r\n';
        }
    }
    
    function PerformOperation(a,n){
        let i, j, k = 0, c, flag = 0, m = 0;
        let pro = 0;
            
        for (i = 0; i < n; i++){
            if (a[i][i] == 0){
                c = 1;
                while ((i + c) < n && a[i + c][i] == 0)
                    c++;        
                if ((i + c) == n){
                    flag = 1;
                    break;
                }
                for (j = i, k = 0; k <= n; k++){
                    let temp =a[j][k];
                    a[j][k] = a[j+c][k];
                    a[j+c][k] = temp;
                }
            }
        
            for (j = 0; j < n; j++){
                if (i != j){
                    let p = a[j][i] / a[i][i];
                    for (k = 0; k <= n; k++)                
                        a[j][k] = a[j][k] - (a[i][k]) * p;            
                }
            }
        }
        return flag;
    }
    
    /* Function to print the desired result if unique solutions exists,
    otherwise prints no solution or infinite solutions depending upon the input given.*/
    function PrintResult(a,n,flag){
        mainMessage += ('Result is : \r\n');
        if (flag == 2) mainMessage += ('Infinite Solutions Exists \r\n');
        else if (flag == 3) mainMessage += ('No Solution Exists \r\n');
        // Printing the solution by dividing constants by their respective diagonal elements
        else {
            for (let i = 0; i < n; i++)        
                mainMessage += (a[i][n] / a[i][i] + ' || ');    
        }
    }
    
    // To check whether infinite solutions exists or no solution exists
    function CheckConsistency(a,n,flag){
        let i, j;
        let sum;
        // flag == 2 for infinite solution
        // flag == 3 for No solution
        flag = 3;
        for (i = 0; i < n; i++){
            sum = 0;
            for (j = 0; j < n; j++)    
                sum = sum + a[i][j];
            if (sum == a[i][j])
                flag = 2;    
        }
        return flag;
    }
    
    // Driver code
    let a = new Array(matheight);
    /* To create augmented matrix */
    for(let i=0; i<matheight.value; i++){
        a[i] = new Array(matwidth);
        for(let j=0; j<matheight.value; j++){
            a[i][j] = matrixAnow[i][j];
        }
        a[i][matheight.value] = matrixBnow[i];
    }
    // Order of Matrix(n)
    let n = matheight.value, flag = 0;
    // Performing Matrix transformation
    flag = PerformOperation(a, n);
    if (flag == 1) flag = CheckConsistency(a, n, flag); 

    // Printing Final Matrix
    mainMessage += ('Final Augmented Matrix is : \r\n');
    PrintMatrix(a, n);
    mainMessage += ('\r\n');
    
    // Printing Solutions(if exist)
    PrintResult(a, n, flag);
}