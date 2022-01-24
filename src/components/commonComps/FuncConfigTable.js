import React, { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import CardHeader from "reactstrap/lib/CardHeader";
import { getFuncFuncgroupsBySectorId } from "network/ApiAxios";

const FuncConfigTable = (props) => {
  const [functionalities, setFunctionalities] = useState([]);
  const clientId = localStorage.getItem("client_id");
  useEffect(() => {
    const runAsync = async () => {
      const res = await getFuncFuncgroupsBySectorId(clientId);
      if (res.data) {
        if (res.data.success) {
          setFunctionalities(res.data.funcBySectorId);
          const temp = {};
          res.data.funcBySectorId.forEach((functionality) => {
            temp[functionality.id] = false;
          });
          props.setPermittedFunc(temp);
        }
      }
    };
    runAsync();
  }, []);

  const handleCheckboxes = (id) => {
    props.setPermittedFunc((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };

  return (
    <>
      <Card className="shadow" style={{ maxHeight: "388px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <h3 className="text-muted">Widgets</h3>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Functionality name</th>
              <th scope="col">Group name</th>
              <th scope="col">Permission</th>
            </tr>
          </thead>
          <tbody>
            {functionalities.length > 0 &&
              functionalities.map((functionality, index) => {
                return (
                  <tr key={functionality.id}>
                    <td>{index + 1}</td>
                    <td>{functionality.functionality_label}</td>
                    <td>{functionality.group_name}</td>
                    <td>
                      <FormGroup check inline>
                        <Input
                          type="checkbox"
                          value={functionality.id}
                          checked={!!props.permittedFunc[functionality.id]}
                          onChange={() => handleCheckboxes(functionality.id)}
                        />
                        <Label check>read</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input type="checkbox" />
                        <Label check>write</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input type="checkbox" />
                        <Label check>delete</Label>
                      </FormGroup>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export default FuncConfigTable;
