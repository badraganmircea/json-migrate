const getObj = (path, obj) => path.split('.').reduce((res, key) => res[key], obj);
const getSourceKey = (sourcePath) => sourcePath.split('.')[sourcePath.split('.').length - 1];

Object.prototype.deleteKey = function (sourcePath) {
    const sourceKey = getSourceKey(sourcePath);
    const sourcePathList = sourcePath.split('.');
    sourcePathList.splice(-1, 1);
    console.log(' source path list ', sourcePathList);
    const sourceObjectPath = sourcePathList.join('.');
    const sourceObject = getObj(sourceObjectPath, this);
    delete sourceObject[sourceKey];
};

Object.prototype.moveKey = function (sourcePath, destinationPath) {
    const source = getObj(sourcePath, this);
    const destination = getObj(destinationPath, this);

    const sourceKey = getSourceKey(sourcePath);
    destination[sourceKey] = source;

    this.deleteKey(sourcePath);
    // TODO: delete source
    // console.log('THIS', this);
};

Object.prototype.renameKey = function (oldKey, newKey) {
    if (oldKey === newKey) {
        return this;
    }
    if (this.hasOwnProperty(oldKey)) {
        this[newKey] = this[oldKey];
        delete this[oldKey];
    }
    return this;
};

Object.prototype.renameKeys = function (oldKey, newKey) {
    if (oldKey === newKey) {
        return this;
    }

    const iterate = (obj) => {
        const objKeys = Object.keys(obj);
        objKeys.forEach(property => {
            if (obj.hasOwnProperty(property)) {
                if (property === oldKey) {
                    obj.renameKey(oldKey, newKey);
                }
                if (typeof obj[property] === "object") {
                    iterate(obj[property]);
                } else {
                    // console.log(property + "   " + obj[property]);
                }
            }
        });
    };

    iterate(this);
    console.log('PRETTY');
    console.log(JSON.stringify(this, null, 2));
};