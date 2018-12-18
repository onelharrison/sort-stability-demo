(function() {
  const insertionSort = sorts.stable.insertionSort;
  const selectionSort = sorts.unstable.selectionSort;

  function App(props = {}) {
    this.appName = 'Sort Stability Demo';
    this.className = 'app';
  
    Rad.Component.call(this, props);
  }
  
  App.prototype = Object.create(Rad.Component.prototype);
  
  App.prototype.render = function() {
    const tables = [
      {
        title: '1. Table sortable by an unstable sort (selection sort)',
        description: `This table is sorted by Name (in ascending order)
          in its default state. <strong>Click a column header to sort the table
          by that column</strong>. Notice how the alphabetical order of the
          names is <strong>NOT</strong> maintained when sorted by Grade. This
          is the work of an unstable sort.`,
        data: { ...this.props.data },
        sortStability: 'unstable'
      },
      {
        title: '2. Table sortable by a stable sort (insertion sort)',
        description: `This table is sorted by Name (in ascending order) in its
          default state. <strong>Click a column header to sort the table by
          that column</strong>. Notice how the alphabetical order of the names
          is maintained when sorted by Grade. This is the work of a stable
          sort.`,
        data: { ...this.props.data },
        sortStability: 'stable'
      }
    ];
  
    return `
      <div id='${this.componentId}' class='${this.className}'>
        <h1 class='app-name'>${this.appName}</h1>
        ${tables.map(tableProps =>
          (new SortableTable({...tableProps})).html).join('')}
      </div>
    `;
  }
  
  function SortableTable(props = {}) {
    this.className = 'sortable-table';
  
    this.state = {
      records: props.data.records,
      sortKey: 'name',
      sortDir: 'asc'
    };
  
    Rad.Component.call(this, props);
  }
  
  SortableTable.prototype = Object.create(Rad.Component.prototype);
  
  SortableTable.prototype._registerListeners = function() {
    const { columns } = this.props.data;
    
    columns.forEach((column, index) => {
      const el = document.getElementById(
        `${this.componentId}-sortable-table-${column.id}-col`
      );
      el.addEventListener('click', this.sortTableBy.bind(this));
    });
  }
  
  SortableTable.prototype.sortTableBy = function(e) {
    const idParts = e.currentTarget.id.split('-')
    const columnId = idParts.slice(3, idParts.length - 1).join('-');
    const { records } = this.props.data;

    const ascCompare = (recordA, recordB) => {
      if (recordA[columnId] < recordB[columnId]) return -1;
      if (recordA[columnId] > recordB[columnId]) return 1;
      return 0;
    }

    const descCompare = (recordA, recordB) => {
      if (recordA[columnId] > recordB[columnId]) return -1;
      if (recordA[columnId] < recordB[columnId]) return 1;
      return 0;
    }

    const newSortDir = (() => {
      if (this.state.sortKey === columnId) {
        return this.state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        return this.state.sortDir;
      }
    })();
  
    const compare = newSortDir === 'asc' ? ascCompare : descCompare;

    const sortedRecords = (() => {
      if (this.props.sortStability === 'stable') {
        return insertionSort([...this.state.records], compare);
      } else if (this.props.sortStability === 'unstable') {
        return selectionSort([...this.state.records], compare);
      } else {
        throw 'Unrecognized or undefined sortStability prop';
      }
    })();
  
    this.setState({
      records: sortedRecords,
      sortKey: columnId,
      sortDir: newSortDir
    });
  }
  
  SortableTable.prototype.render = function() {
    const { columns } = this.props.data;
  
    return `
      <div id='${this.componentId}' class='${this.className}'>
        <h2 class='sortable-table-title'>${this.props.title}</h2>
        <div class='sortable-table-description'>${this.props.description}</div>
        <table>
          <thead>
            <tr>
              <th class='sortable-table-row-num sortable-table-col-header'>
                #
              </th>
              ${columns.map((column, index) => `
                <th
                  id='${this.componentId}-sortable-table-${column.id}-col'
                  class='sortable-table-col-header'
                >
                  ${column.label}
                  <span>
                    ${this.state.sortKey === column.id
                      ? this.state.sortDir === 'asc' ? '▲' : '▼'
                      : ''}
                  </span>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${this.state.records.map((record, index) => `
              <tr class='sortable-table-row'>
                <td class='sortable-table-row'>${index + 1}</td>
                ${columns.map(column => `
                  <td>${record[column.id]}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table> 
      </div>
    `;
  }

  RadDOM.render(new App({data: {...data}}), document.getElementById('app'));
})();
