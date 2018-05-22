var matIV = {
    // create the class
    create: function (){
        return mat = [
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ];
    },

    identity: function (dest) {
        // identity the matrix
        return dest = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
    },

    mutiply: function (mat1, mat2, dest) {
        // 0 ~ 15 0,4,8,12  row * col
        var res = 0;
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++) {
                for(let k = 0; k < 4; k++){
                    res += mat1[4 *i + k] * mat2[j + 4 * k];
                }
                dest[ i * 4 + j] = res;
                res = 0 ;
            }
        }
        return dest;
    } 
};
