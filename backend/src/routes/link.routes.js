const router=require('express').Router();
const authenticate=require('../middleware/auth.middleware')
const validate=require('../middleware/validate')

const {createLinkSchema,updateLinkSchema}=require("../validation/link.validation")
const cont=require('../controllers/link.controller')

router.use(authenticate)
router.post('/',validate(createLinkSchema),cont.create);
router.get('/',cont.list);
router.get('/:id',cont.getOne);
router.patch('/:id',validate(updateLinkSchema),cont.updateLink)
router.delete('/:id',cont.remove);

module.exports=router;


