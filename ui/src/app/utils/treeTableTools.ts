import { SortFile } from '@shared/components/ant-table/ant-table.component';
import { TreeNodeInterface } from '@shared/components/tree-table/tree-table.component';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

function convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
  const stack: TreeNodeInterface[] = [];
  const array: TreeNodeInterface[] = [];
  const hashMap = {};
  stack.push({ ...root, level: 0, expand: false, _checked: false });

  while (stack.length !== 0) {
    const node = stack.pop()!;
    visitNode(node, hashMap, array);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ ...node.children[i], level: node.level! + 1, _checked: false, expand: false, parent: node });
      }
    }
  }

  return array;
}

function visitNode(node: TreeNodeInterface, hashMap: Record<string, boolean>, array: TreeNodeInterface[]): void {
  if (!hashMap[node.id]) {
    hashMap[node.id] = true;
    array.push(node);
  }
}

// lấymaphình thứctreeData,Tham số đầu vào làdataList
const fnTreeDataToMap = function tableToTreeData(dataList: NzSafeAny[]): Record<string, TreeNodeInterface[]> {
  const mapOfExpandedData: Record<string, TreeNodeInterface[]> = {};
  dataList.forEach(item => {
    mapOfExpandedData[item.id] = convertTreeToList(item);
  });
  return mapOfExpandedData;
};

/**
 * Phương pháp này được sử dụng để chuyển mảng có quan hệ cha con sang mảng cấu trúc cây
 * Nhận một mảng có quan hệ cha con làm tham số
 * Quay lạiMột mảng có cấu trúc cây
 */
const fnFlatDataHasParentToTree = function translateDataToTree(data: NzSafeAny[], fatherId = 'fatherId'): NzSafeAny {
  // Chúng tôi cho rằng,fatherId=0dữ liệu, là dữ liệu cấp một
  //Dữ liệu không có nút cha
  const parents = data.filter(value => value[fatherId] === 0);

  //Dữ liệu có nút cha
  const children = data.filter(value => value[fatherId] !== 0);

  //Định nghĩa triển khai cụ thể của phương pháp chuyển đổi
  const translator = (parents: NzSafeAny[], children: NzSafeAny[]): NzSafeAny => {
    //Duyệt dữ liệu nút cha
    parents.forEach(parent => {
      //Duyệt dữ liệu các nút con
      children.forEach((current, index) => {
        //Lúc này tìm một nút con tương ứng với nút cha
        if (current[fatherId] === parent.id) {
          //Thực hiện sao chép sâu dữ liệu của các nút con, ở đây chỉ hỗ trợ sao chép sâu một số loại dữ liệu, những bạn không hiểu về sao chép sâu có thể tìm hiểu trước về sao chép sâu
          const temp = JSON.parse(JSON.stringify(children));
          //Để nút con hiện tại từtempgỡ bỏ ở giữa,tempLà dữ liệu nút con mới, đây là để khi đệ quy, số lần duyệt các nút con sẽ ít hơn, nếu cấp bậc cha con càng nhiều thì càng có lợi
          temp.splice(index, 1);
          //Đặt nút con hiện tại làm nút cha duy nhất, sau đó đệ quy tìm kiếm các nút con tương ứng của nó
          translator([current], temp);
          //Đặt các nút con đã tìm được vào nút chachildrenTrong thuộc tính
          typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
        }
      });
    });
  };
  //Gọi phương thức chuyển đổi
  translator(parents, children);
  return parents;
};

// Đưa dữ liệu cấu trúc câyThêmCấp bậc và dấu hiệu có phải là nút gốc hay không, nút gốcisLeafvìtruecấp bậc dolevelbiểu thị
const fnAddTreeDataGradeAndLeaf = function AddTreeDataGradeAndLeaf(array: NzSafeAny[], levelName = 'level', childrenName = 'children'): NzSafeAny[] {
  const recursive = (array: NzSafeAny[], level = 0): NzSafeAny => {
    level++;
    return array.map((v: NzSafeAny) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length > 0) {
        v.isLeaf = false;
        recursive(child, level);
      } else {
        v.isLeaf = true;
      }
      return v;
    });
  };
  return recursive(array);
};

// làm phẳngtreedữ liệu
const fnFlattenTreeDataByDataList = function flattenTreeData(dataList: NzSafeAny[]): TreeNodeInterface[] {
  const mapOfExpandedData: Record<string, TreeNodeInterface[]> = fnTreeDataToMap(dataList);
  return fnGetFlattenTreeDataByMap(mapOfExpandedData);
};

// Lấy giá trung bìnhtreedữ liệu,Tham số đầu vào làmaphình thứctreeData
const fnGetFlattenTreeDataByMap = function getFlattenTreeData(mapOfExpandedData: Record<string, TreeNodeInterface[]>): TreeNodeInterface[] {
  const targetArray: TreeNodeInterface[] = [];
  Object.values(mapOfExpandedData).forEach(item => {
    item.forEach(item_1 => {
      targetArray.push(item_1);
    });
  });
  return targetArray;
};

// Sắp xếp dữ liệu cấu trúc cây
const fnSortTreeData = function sortTreeData(data: TreeNodeInterface[], sortObj: SortFile): void {
  data.forEach(item => {
    if (item.children && item.children.length > 0) {
      fnSortTreeData(item.children, sortObj);
    }
  });
  data.sort((a, b) => {
    const aValue = a[sortObj.fileName];
    const bValue = b[sortObj.fileName];

    if (sortObj.sortDir === 'asc') {
      return aValue - bValue; // Tăng dần
    } else if (sortObj.sortDir === 'desc') {
      return bValue - aValue; // Giảm dần
    }
    return 0; // Trường hợp không sắp xếp
  });
};

export { fnTreeDataToMap, fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnGetFlattenTreeDataByMap, fnSortTreeData };
