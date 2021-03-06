var ok = require('assert').ok

function Area (left, top, bottom, right) { // :: Int -> Int -> Int -> Int -> Area
    this.left = left
    this.top = top
    this.bottom = bottom
    this.right = right
    this.height = this.top - bottom
    this.width = right - this.left
    this.area = this.width * this.height
}

Area.prototype.intersect = function (other) { // :: Area -> Area 
  var left = Math.max(this.left, other.left),
      top = Math.min(this.top, other.top),
      bottom = Math.max(this.bottom, other.bottom),
      right = Math.min(this.right, other.right),
      width = right - left,
      height = top - bottom
  if (width < 0 || height < 0) {
    return null
  }
  return new Area(left, top, bottom, right)
}

Area.prototype.intersects = function (other) { // :; Area -> Bool
    return ((other.left < this.right && this.right < other.right) ||
           (other.left < this.left && this.right < other.right) ||
           (other.top  > this.top && this.top < other.bottom) ||
           (other.bottom < this.top && this.top < other.top))
}

Area.prototype.combine = function (other) { // :: Area -> Area
    ok(other instanceof Area, 'other instanceof Area')
    var left = Math.min(this.left, other.left)
    var top = Math.max(this.top, other.top)
    var bottom = Math.min(this.bottom, other.bottom)
    var right = Math.max(this.right, other.right)
    return new Area(left, top, bottom, right)
}
Area.prototype.containsPoint = function (x, y) { // :: Int -> Int -> Bool
  return (x >= this.left && x <= this.right && y <= this.top && y >= this.bottom)
}
Area.prototype.containsRect = function (other) { // :: Area -> Bool
  return this.containsPoint(other.left, other.top) && this.containsPoint(other.right, other.bottom)
}

Area.prototype.splitX = function (split) { // :: [Area, Area]
    return [
        new Area(this.left, this.top, this.bottom, split),
        new Area(split, this.top, this.bottom, this.right)
    ]
}

Area.prototype.splitY = function (split) { // :: [Area, Area]
    var bottom
    if (!isFinite(this.bottom)) {
        bottom = split
    }
    return [
        new Area(this.left, split, this.bottom, this.right),
        new Area(this.left, this.top, bottom || this.bottom + split, this.right)
    ]
}

exports.Area = Area
