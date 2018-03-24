
function getSquareCoordinates (square, grid) {
  // @examples:
  //   1 = 1 % 10 || 10 // Square #1, x = 1
  //   9 = 6 % 10 || 10 // Square #9, x = 9
  //   10 = 10 % 10 || 10 // Square # 10, x = 10; NOTE: 10 % 10 is 0, so we swap with 10 to make it correct
  const x = (square.number % grid.width) || grid.width;

  // @examples:
  //  1 = ceil(1 / 10) // Square #1, y = 1;
  //  1 = ceil(9 / 10  // Square #9, y = 1;
  //  1 = ceil(10 / 10) // Square #10, y = 1;
  //  2 = ceil(11 / 10) // Square #11, y = 2;
  //  3 = ceil(21 / 10) // Square #21, y = 3; NOTE: Square #21 is on row 3, which is correct
  const y = Math.ceil(square.number / grid.width);

  return { x, y };
}

function getSquareNeighbors (coordinates, grid) {
  const neighbors = {
    top: null,
    right: null,
    bottom: null,
    left: null
  };

  const number = coordinates.x + ((coordinates.y - 1) * grid.width);

  if (coordinates.y > 1) {
    neighbors.top = Math.abs(number - grid.width);
  }

  if (coordinates.x < grid.width) {
    neighbors.right = number + 1;
  }

  if (coordinates.y < grid.height) {
    neighbors.bottom = number + grid.width;
  }

  if (coordinates.x > 1) {
    neighbors.left = number - 1;
  }

  return neighbors;
}

function logSquareCalc (square, grid) {
  const coordinates = getSquareCoordinates(square, grid);
  const neighbors = getSquareNeighbors(coordinates, grid);
  console.log(coordinates, neighbors);
}
module.exports = { getSquareCoordinates, getSquareNeighbors };
