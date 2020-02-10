import { zip } from 'lodash';

const render_tablero = ({
    line,
    index_column,
    color = 'green',
    size = 88,
    margin = 2,
}) => {
    const row = document.createElement('div');
    row.style.width = '100px'
    line.map(
        (cell, index_row) => render_celdas({
            size,
            cell,
            margin,
            color,
            index_column,
            index_row,
        })
    ).forEach(
        celda => row.appendChild(celda),
    )
    return row;
};

const render_celdas = ({
    size,
    cell,
    margin,
    color,
    index_column,
    index_row,
}) => {
    const celda = document.createElement('div');
    celda.style.width = `${size}px`;
    celda.style.height = `${size}px`;
    celda.style.margin = `${margin}px`
    celda.style.padding = '4px';
    celda.style.backgroundColor = color;
    celda.style.alignContent = 'center';
    celda.style.transition = '0.25s';

    celda.addEventListener('mouseleave', e => {
        celda.style.opacity = '1'
    });

    celda.addEventListener('mouseenter', e => {
        celda.style.opacity = '0.75'
    });

    celda.onclick = () => {
        STATE.estado[index_row][index_column] === 0 ? check(
            index_column,
            index_row,
        ) : 
        alert("No puede colocar su ficha aquí")
    };

    if(cell === 0)
    {
        if(all_possible(index_column, index_row) === true)
        {
            cell = 3
            STATE.espacios += 1
        }
    }

    const ficha = document.createElement('div');
    ficha.style.borderRadius = `${size/2}px`;
    ficha.style.width = `${size}px`;
    ficha.style.height = `${size}px`;
    ficha.style.transition = '0.25s';
    
    cell === 0 ? ficha.style.backgroundColor = 'transparent' : 
    cell === 1 ? ficha.style.backgroundColor = 'black' :
    cell === 2 ? ficha.style.backgroundColor = 'white' :
    ficha.style.border = 'solid black 1px';

    celda.appendChild(ficha);
    return celda
}

const check = (index_column, index_row) => {
    const turn = STATE.turn;
    let own_token = true;
    turn === true ? own_token = 1 : own_token = 2;

    const r = sides(index_column, index_row, 1, 0, own_token)
    const l = sides(index_column, index_row, -1, 0, own_token)
    const b = sides(index_column, index_row, 0, 1, own_token)
    const t = sides(index_column, index_row, 0, -1, own_token)
    const br = sides(index_column, index_row, 1, 1, own_token)
    const tr = sides(index_column, index_row, 1, -1, own_token)
    const bl = sides(index_column, index_row, -1, 1, own_token)
    const tl = sides(index_column, index_row, -1, -1, own_token)

    if(r == true || l == true || b == true || t == true || br == true || tr == true || bl == true || tl == true)
    {
        STATE.turn = !STATE.turn
        STATE.espacios = 0
    }
    else
    {
        alert("No se puede colocar la ficha en esa casilla")
    }

    root.innerHTML = ''
    render(root, MATRIX, STATE)
}

const sides = (index_column, index_row, pend_x, pend_y, token, others = 0) => {
    let result = false;
    const tablero = STATE.estado;
    const table = MATRIX.trans_estado
    const temp_col = index_column + pend_x;
    const temp_row = index_row + pend_y;
    let next_cell = null;
    temp_row < 0 || temp_row > 7 || temp_col > 7 || temp_col < 0
    ? next_cell = next_cell :
    next_cell = tablero[temp_row][temp_col];

    if(next_cell != null && next_cell != token  && next_cell != 0 && temp_col <= 7 && temp_row <= 7 && temp_col >= 0 && temp_row >= 0)
    {
        const x = sides(temp_col, temp_row, pend_x, pend_y, token, (others + 1))
        if(x == true)
        {
            table[index_column][index_row] = token
            result = true
        }
    }
    else
    {
        if(others == 0)
        {
            result = false
        }
        else if(next_cell === token && temp_col <= 7 && temp_row <= 7 && temp_col >= 0 && temp_row >= 0)
        {
            table[index_column][index_row] = token
            result = true
        }
        else
        {
            result = false
        }
    }

    return result
}

const possible = (index_column, index_row, pend_x, pend_y, token, others = 0) => {
    let result = false;
    const tablero = STATE.estado;
    const temp_col = index_column + pend_x;
    const temp_row = index_row + pend_y;
    let next_cell = null;
    temp_row < 0 || temp_row > 7 || temp_col > 7 || temp_col < 0
    ? next_cell = next_cell :
    next_cell = tablero[temp_row][temp_col];

    if(next_cell != null && next_cell != token  && next_cell != 0 && next_cell != 3 && temp_col <= 7 && temp_row <= 7 && temp_col >= 0 && temp_row >= 0)
    {
        const x = possible(temp_col, temp_row, pend_x, pend_y, token, (others + 1))
        if(x == true)
        {
            result = true
        }
    }
    else
    {
        if(others == 0)
        {
            result = false
        }
        else if(next_cell === token && temp_col <= 7 && temp_row <= 7 && temp_col >= 0 && temp_row >= 0)
        {
            result = true
        }
        else
        {
            result = false
        }
    }

    return result
}

const all_possible = (index_column, index_row) => {
    const turn = STATE.turn;
    let own_token = true;
    turn === true ? own_token = 1 : own_token = 2;

    const r = possible(index_column, index_row, 1, 0, own_token)
    const l = possible(index_column, index_row, -1, 0, own_token)
    const b = possible(index_column, index_row, 0, 1, own_token)
    const t = possible(index_column, index_row, 0, -1, own_token)
    const br = possible(index_column, index_row, 1, 1, own_token)
    const tr = possible(index_column, index_row, 1, -1, own_token)
    const bl = possible(index_column, index_row, -1, 1, own_token)
    const tl = possible(index_column, index_row, -1, -1, own_token)

    if(r == true || l == true || b == true || t == true || br == true || tr == true || bl == true || tl == true)
    {
        return true
    }
    else
    {
        return false
    }
}

const available = () => {
    if(STATE.espacios === 0)
    {
        STATE.turn === true ? alert("Jugador 1 no tiene espacios disponibles, cambio de turno") :
        alert("Jugador 2 no tiene espacios disponibles, cambio de turno")

        STATE.turn = !STATE.turn
        root.innerHTML = ''
        render(root, MATRIX, STATE)
    }
}

const render = (mount, matrix) => {
    const contenedor_tablero = document.createElement('div');
    const tablero = matrix.trans_estado;
    STATE.estado = _.zip.apply(_, tablero);

    contenedor_tablero.style.display = 'flex';
    contenedor_tablero.style.flexFlow = 'initial';
    contenedor_tablero.style.width = '800px';
    contenedor_tablero.style.backgroundColor = 'black';
    contenedor_tablero.style.padding = '4px';

    boton.style.width = '800px';
    boton.style.height = '40px';
    boton.style.fontSize = '20px';
    boton.innerHTML = 'Jugar de nuevo';
    boton.style.display = 'none';
    boton.onclick = () => {
        STATE.estado = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,1,2,0,0,0],
            [0,0,0,2,1,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            ];
        MATRIX.trans_estado = _.zip.apply(_, STATE.estado);

        root.innerHTML = ''
        render(root, MATRIX, STATE)
    }

    tablero.map(
        (line, index_column) => render_tablero({
            line,
            index_column,
        })
    ).forEach(
        columna => contenedor_tablero.appendChild(columna)
    );

    let espacios_vacios = 0
    let jugador_1 = 0
    let jugador_2 = 0

    tablero.map(
        (line) => line.map(
            (cell) => cell === 0 ? espacios_vacios += 1 : 
            cell === 1 ? jugador_1 += 1 : jugador_2 +=1
        )
    )

    mount.appendChild(contenedor_tablero);
    mount.appendChild(boton);

    if(espacios_vacios === 0)
    {
        boton.style.display = 'block';
        if(jugador_1 > jugador_2)
        {
            alert("Juego terminado, JUGADOR 1 GANA!!")
        }
        else
        {
            alert("Juego terminado, JUGADOR 2 GANA!!")
        }
    }
    else
    {
        available()
    }
};

const STATE = {
    turn: true,
    estado: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,2,0,0,0],
        [0,0,0,2,1,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ],
    espacios: 0,
};

const MATRIX = {
    trans_estado: _.zip.apply(_, STATE.estado),
}

const root = document.getElementById('root');
const boton = document.createElement('button');

render(root, MATRIX);
