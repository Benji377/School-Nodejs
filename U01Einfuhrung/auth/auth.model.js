const users = [
    { username: 'sepp', password: 'sepp', firstname: 'Sepp', lastname: 'Hintner' },
    { username: 'resi', password: 'resi', firstname: 'Resi', lastname: 'Rettich' },
    { username: 'rudi', password: 'rudi', firstname: 'Rudi', lastname: 'Rüpel' }
];
function get(username) {
    const user = users.find(user => user.username === username);
    return user ? Object.assign({}, user) : null;
}
module.exports = { get };
