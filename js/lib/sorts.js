var sorts = (function() {

  function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  function defaultCompare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  
  function selectionSort(arr, compare = defaultCompare) {
    for (let i = 0; i < arr.length; i++) {
      let comparableIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (compare(arr[j], arr[comparableIndex]) < 0 ) {
          comparableIndex = j;
        }
      }
      swap(arr, i, comparableIndex);
    }
    return arr;
  }
  
  function insertionSort(arr, compare = defaultCompare) {
    for (let i = 1; i < arr.length; i++) {
      for (let j = i; j-1 >= 0 && compare(arr[j], arr[j-1]) < 0; j--) {
        swap(arr, j, j-1);
      }
    }
    return arr;
  }
  
  return {
    unstable: {
      selectionSort
    },
    stable: {
      insertionSort
    }
  };
})();
