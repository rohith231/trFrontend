import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { InsertOrUpdateLayers } from "network/ApiAxios";

const PortalItemForm = (props) => {
  const [portalItems, setPortalItems] = useState([
    { url: "", type: "", key: 0 },
  ]);
  const [error, setError] = useState("");
  const mutation = useMutation(InsertOrUpdateLayers);
  const history = useHistory();

  const removeFuncFields = (i) => {
    let newPortalItems = [...portalItems];
    newPortalItems.splice(i, 1);
    setPortalItems(newPortalItems);
  };
  const addFuncFields = (e) => {
    setPortalItems([...portalItems, { url: "", type: "", key: e.timeStamp }]);
  };

  const onAddClick = () => {
    if (
      portalItems.every((portalItem) => {
        return portalItem.url.length > 0;
      })
    ) {
      if (props.roleId) {
        mutation.mutate(
          {
            portalItems,
            roleId: props.roleId,
          },
          {
            onSuccess: (response) => {
              const { data } = response;
              if (data.success) {
                setError("");
                setPortalItems([{ url: "", type: "", key: 0 }]);
                history.push("/admin/index");
              } else {
                setError(data.msg);
              }
            },
          }
        );
      } else {
        setError("select role id to allocate");
      }
    } else {
      setError("Please enter URL");
    }
  };
  const onInputChange = async (e, index) => {
    let newPortalItems = [...portalItems];
    newPortalItems[index][e.target.name] = e.target.value;
    // try {
    // } catch (error) {
    //   newPortalItems[index].type = error.message;
    // }
    setPortalItems(newPortalItems);
  };
  return (
    <Container>
      {portalItems.map((portalItem, index) => {
        return (
          <div key={portalItem.key}>
            <FormGroup>
              <p>{portalItem.type}</p>
            </FormGroup>
            <InputGroup className="mb-2">
              <Input
                placeholder="URL"
                name="url"
                type="text"
                value={portalItem.piId}
                onChange={(e) => onInputChange(e, index)}
              />
              {index ? (
                <Button size="sm" onClick={() => removeFuncFields(index)}>
                  <i className="fas fa-minus"></i>
                </Button>
              ) : null}
            </InputGroup>
          </div>
        );
      })}
      <FormGroup>
        <Button color="primary" size="sm" onClick={addFuncFields}>
          add more..
        </Button>
      </FormGroup>
      <div>
        {error ? (
          <div className="text-muted font-italic">
            <small>
              error: <span className="text-red font-weight-700">{error}</span>
            </small>
          </div>
        ) : null}
      </div>
      <FormGroup className="text-center">
        <Button color="primary" onClick={onAddClick}>
          ADD
        </Button>
      </FormGroup>
    </Container>
  );
};

export default PortalItemForm;
